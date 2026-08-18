import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { sendCitaReminderEmail } from "../_lib/partnerEmails.js";

const VENTANA_MIN_MINUTOS = 20;
const VENTANA_MAX_MINUTOS = 40;

export default async function handler(req, res) {
  // Vercel Cron llama a este endpoint con GET; también aceptamos POST para disparos manuales.
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    res.status(401).json({ error: "No autorizado." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: citas, error } = await supabaseAdmin
    .from("citas_compartidas")
    .select("id, mother_id, fecha, hora, tipo, medico, lugar, partner_rsvp")
    .is("reminder_sent_at", null)
    .not("hora", "is", null);

  if (error) {
    res.status(500).json({ error: "No se pudieron leer las citas." });
    return;
  }

  const now = Date.now();
  const windowStartMs = now + VENTANA_MIN_MINUTOS * 60 * 1000;
  const windowEndMs = now + VENTANA_MAX_MINUTOS * 60 * 1000;

  const candidatas = (citas || []).filter((c) => {
    if (!c.hora) return false;
    const citaMs = new Date(`${c.fecha}T${c.hora}:00-03:00`).getTime();
    return citaMs >= windowStartMs && citaMs < windowEndMs;
  });

  let sent = 0;
  for (const cita of candidatas) {
    const { data: partner } = await supabaseAdmin
      .from("partners")
      .select("email, notif_recordatorios_email")
      .eq("mother_id", cita.mother_id)
      .maybeSingle();

    if (!partner?.email || partner.notif_recordatorios_email === false) continue;

    const { data: motherUser } = await supabaseAdmin.auth.admin.getUserById(cita.mother_id);
    const motherNombre = motherUser?.user?.user_metadata?.nombre || "tu pareja";

    try {
      await sendCitaReminderEmail(partner.email, { ...cita, motherNombre });
      await supabaseAdmin
        .from("citas_compartidas")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", cita.id);
      sent++;
    } catch (err) {
      console.error("No se pudo enviar recordatorio de cita:", err.message);
    }
  }

  res.status(200).json({ success: true, sent });
}
