import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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
    .select("mother_id")
    .eq("partner_user_id", partnerUser.id)
    .maybeSingle();

  if (!link) {
    res.status(403).json({ error: "Esta cuenta no está vinculada como partner." });
    return;
  }

  const { data: motherUser } = await supabaseAdmin.auth.admin.getUserById(link.mother_id);
  const motherNombre = motherUser?.user?.user_metadata?.nombre || "";

  const todayISO = new Date().toISOString().slice(0, 10);
  const catorceDiasAtras = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [{ data: citas }, { data: sintomas }, { data: notas }] = await Promise.all([
    supabaseAdmin
      .from("citas_compartidas")
      .select("id, fecha, hora, tipo, medico, lugar, partner_rsvp")
      .eq("mother_id", link.mother_id)
      .gte("fecha", todayISO)
      .order("fecha", { ascending: true }),
    supabaseAdmin
      .from("sintomas_compartidos")
      .select("fecha, sintomas")
      .eq("mother_id", link.mother_id)
      .gte("fecha", catorceDiasAtras)
      .order("fecha", { ascending: false }),
    supabaseAdmin
      .from("partner_notes")
      .select("id, texto, created_at")
      .eq("mother_id", link.mother_id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  res.status(200).json({
    motherNombre,
    citas: citas || [],
    sintomas: sintomas || [],
    notas: notas || [],
  });
}
