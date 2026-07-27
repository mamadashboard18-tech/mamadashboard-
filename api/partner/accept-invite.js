import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const { token, nombre, email, password } = req.body || {};
  if (!token?.trim() || !nombre?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: "Completá todos los campos." });
    return;
  }
  if (!isValidEmail(email) || password.length < 6) {
    res.status(400).json({ error: "Revisá el email y que la contraseña tenga al menos 6 caracteres." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: invite } = await supabaseAdmin
    .from("partner_invites")
    .select("id, mother_id, status, expires_at")
    .eq("token", token.trim())
    .maybeSingle();

  if (!invite || invite.status !== "pending" || new Date(invite.expires_at).getTime() < Date.now()) {
    res.status(400).json({ error: "Este link de invitación ya no es válido." });
    return;
  }

  const { data: yaVinculado } = await supabaseAdmin
    .from("partners")
    .select("mother_id")
    .eq("mother_id", invite.mother_id)
    .maybeSingle();

  if (yaVinculado) {
    res.status(400).json({ error: "Esta invitación ya fue usada." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { nombre: nombre.trim(), rol: "partner" },
  });

  if (createError) {
    res.status(400).json({ error: createError.message });
    return;
  }

  const { error: partnerError } = await supabaseAdmin.from("partners").insert({
    mother_id: invite.mother_id,
    partner_user_id: created.user.id,
    nombre: nombre.trim(),
    email: normalizedEmail,
  });

  if (partnerError) {
    res.status(500).json({ error: "No se pudo vincular la cuenta. Intentá de nuevo." });
    return;
  }

  await supabaseAdmin.from("partner_invites").update({ status: "accepted" }).eq("id", invite.id);

  res.status(200).json({ success: true });
}
