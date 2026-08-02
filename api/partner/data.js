import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

async function handleRsvp(req, res, supabaseAdmin, link) {
  const { citaId, respuesta } = req.body || {};
  if (!citaId || !["puede", "no_puede"].includes(respuesta)) {
    res.status(400).json({ error: "Datos inválidos." });
    return;
  }

  const { data: cita } = await supabaseAdmin
    .from("citas_compartidas")
    .select("id, mother_id")
    .eq("id", citaId)
    .maybeSingle();

  if (!cita || cita.mother_id !== link.mother_id) {
    res.status(404).json({ error: "Cita no encontrada." });
    return;
  }

  await supabaseAdmin
    .from("citas_compartidas")
    .update({ partner_rsvp: respuesta, partner_rsvp_at: new Date().toISOString() })
    .eq("id", citaId);

  res.status(200).json({ success: true });
}

async function handleGetData(req, res, supabaseAdmin, link) {
  const { data: motherUser } = await supabaseAdmin.auth.admin.getUserById(link.mother_id);
  const motherNombre = motherUser?.user?.user_metadata?.nombre || "";

  const todayISO = new Date().toISOString().slice(0, 10);
  const catorceDiasAtras = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [{ data: perfil }, { data: citas }, { data: sintomas }, { data: notas }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("semana_actual")
      .eq("id", link.mother_id)
      .maybeSingle(),
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
      .select("id, texto, created_at, leida_at")
      .eq("mother_id", link.mother_id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const notasSinLeer = (notas || []).filter((n) => !n.leida_at).map((n) => n.id);
  if (notasSinLeer.length > 0) {
    const leidaAt = new Date().toISOString();
    await supabaseAdmin.from("partner_notes").update({ leida_at: leidaAt }).in("id", notasSinLeer);
    notas.forEach((n) => {
      if (notasSinLeer.includes(n.id)) n.leida_at = leidaAt;
    });
  }

  res.status(200).json({
    motherNombre,
    semanaActual: perfil?.semana_actual || null,
    citas: citas || [],
    sintomas: sintomas || [],
    notas: notas || [],
  });
}

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
    .select("mother_id")
    .eq("partner_user_id", partnerUser.id)
    .maybeSingle();

  if (!link) {
    res.status(403).json({ error: "Esta cuenta no está vinculada como partner." });
    return;
  }

  if (req.method === "POST") {
    await handleRsvp(req, res, supabaseAdmin, link);
  } else {
    await handleGetData(req, res, supabaseAdmin, link);
  }
}
