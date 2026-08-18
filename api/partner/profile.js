import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const partnerUser = await getUserFromRequest(req, supabaseAdmin);
  if (!partnerUser) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  const { data: link } = await supabaseAdmin
    .from("partners")
    .select("nombre, email, notif_recordatorios_email, notif_nota_email")
    .eq("partner_user_id", partnerUser.id)
    .maybeSingle();

  if (!link) {
    res.status(403).json({ error: "Esta cuenta no está vinculada como partner." });
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({
      nombre: link.nombre || "",
      email: link.email || partnerUser.email || "",
      notifRecordatoriosEmail: link.notif_recordatorios_email ?? true,
      notifNotaEmail: link.notif_nota_email ?? true,
    });
    return;
  }

  const { nombre, notifRecordatoriosEmail, notifNotaEmail } = req.body || {};
  const updates = {};
  if (typeof nombre === "string" && nombre.trim()) updates.nombre = nombre.trim();
  if (typeof notifRecordatoriosEmail === "boolean") updates.notif_recordatorios_email = notifRecordatoriosEmail;
  if (typeof notifNotaEmail === "boolean") updates.notif_nota_email = notifNotaEmail;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Nada para actualizar." });
    return;
  }

  const { error: updateError } = await supabaseAdmin
    .from("partners")
    .update(updates)
    .eq("partner_user_id", partnerUser.id);

  if (updateError) {
    res.status(500).json({ error: "No se pudo actualizar. Intentá de nuevo." });
    return;
  }

  if (updates.nombre) {
    await supabaseAdmin.auth.admin.updateUserById(partnerUser.id, {
      user_metadata: { ...partnerUser.user_metadata, nombre: updates.nombre },
    });
  }

  res.status(200).json({ success: true });
}
