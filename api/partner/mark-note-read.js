import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const { notaId } = req.body || {};
  if (!notaId) {
    res.status(400).json({ error: "Datos inválidos." });
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

  const { data: nota } = await supabaseAdmin
    .from("partner_notes")
    .select("id, mother_id")
    .eq("id", notaId)
    .maybeSingle();

  if (!nota || nota.mother_id !== link.mother_id) {
    res.status(404).json({ error: "Nota no encontrada." });
    return;
  }

  await supabaseAdmin
    .from("partner_notes")
    .update({ leida_at: new Date().toISOString() })
    .eq("id", notaId)
    .is("leida_at", null);

  res.status(200).json({ success: true });
}
