import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function findUserByEmail(supabaseAdmin, email) {
  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) return null;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
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

  let partnerUserId;

  if (createError) {
    const yaRegistrado = /already.*registered|already.*exists/i.test(createError.message);
    if (!yaRegistrado) {
      res.status(400).json({ error: "No se pudo crear la cuenta. Intentá de nuevo." });
      return;
    }

    // El email ya existe en Auth: puede ser un ex-partner (removido previamente) que vuelve
    // a ser invitado con el mismo email. Si no está vinculado a ninguna mamá, reusamos la
    // cuenta en vez de bloquear la invitación.
    const existingUser = await findUserByEmail(supabaseAdmin, normalizedEmail);
    if (!existingUser) {
      res.status(400).json({ error: "Ya existe una cuenta con ese email. Usá otro email para el partner." });
      return;
    }

    const { data: yaEsPartnerActivo } = await supabaseAdmin
      .from("partners")
      .select("mother_id")
      .eq("partner_user_id", existingUser.id)
      .maybeSingle();

    if (yaEsPartnerActivo) {
      res.status(400).json({ error: "Ese email ya está vinculado como partner de otra cuenta. Usá otro email." });
      return;
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password,
      user_metadata: { nombre: nombre.trim(), rol: "partner" },
    });

    if (updateError) {
      res.status(400).json({ error: "No se pudo crear la cuenta. Intentá de nuevo." });
      return;
    }

    partnerUserId = existingUser.id;
  } else {
    partnerUserId = created.user.id;
  }

  const { error: partnerError } = await supabaseAdmin.from("partners").insert({
    mother_id: invite.mother_id,
    partner_user_id: partnerUserId,
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
