import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

async function isValidCode(supabaseAdmin, email, code) {
  const { data: record } = await supabaseAdmin
    .from("email_verification_codes")
    .select("code, expires_at")
    .eq("email", email)
    .maybeSingle();
  const isExpired = record && new Date(record.expires_at).getTime() < Date.now();
  return Boolean(record) && record.code === code.trim() && !isExpired;
}

// Cambio de email de una cuenta existente. Vive en este mismo archivo (en vez
// de un endpoint nuevo) por el límite de 12 funciones del plan Hobby de Vercel.
async function handleChangeEmail(req, res) {
  const { email, code } = req.body || {};
  if (!email?.trim() || !code?.trim()) {
    res.status(400).json({ error: "Completá el email y el código." });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const supabaseAdmin = getSupabaseAdmin();

  const user = await getUserFromRequest(req, supabaseAdmin);
  if (!user) {
    res.status(401).json({ error: "Tu sesión expiró. Volvé a iniciar sesión." });
    return;
  }

  if (!(await isValidCode(supabaseAdmin, normalizedEmail, code))) {
    res.status(400).json({ error: "Código inválido o vencido." });
    return;
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    email: normalizedEmail,
    email_confirm: true,
  });
  if (error) {
    const taken = /already|registered|exists/i.test(error.message);
    res.status(400).json({ error: taken ? "Ese email ya está en uso." : error.message });
    return;
  }

  await supabaseAdmin.from("email_verification_codes").delete().eq("email", normalizedEmail);
  res.status(200).json({ success: true, email: normalizedEmail });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  if (req.body?.mode === "change-email") {
    await handleChangeEmail(req, res);
    return;
  }

  const { nombre, apellido, fecha_nacimiento, semana_embarazo, celular, email, password, code } =
    req.body || {};
  const semanaNum = Number(semana_embarazo);
  if (
    !nombre?.trim() ||
    !apellido?.trim() ||
    !fecha_nacimiento ||
    !Number.isFinite(semanaNum) ||
    semanaNum < 1 ||
    semanaNum > 42 ||
    !celular?.trim() ||
    !email?.trim() ||
    !password ||
    !code?.trim()
  ) {
    res.status(400).json({ error: "Completá todos los campos." });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();

  const supabaseAdmin = getSupabaseAdmin();

  if (!(await isValidCode(supabaseAdmin, normalizedEmail, code))) {
    res.status(400).json({ error: "Código inválido o vencido." });
    return;
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      fecha_nacimiento,
      semana_embarazo: semanaNum,
      celular: celular.trim(),
    },
  });

  if (createError) {
    res.status(400).json({ error: createError.message });
    return;
  }

  await supabaseAdmin.from("email_verification_codes").delete().eq("email", normalizedEmail);

  res.status(200).json({
    success: true,
    user: { id: created.user.id, nombre: nombre.trim(), email: normalizedEmail },
  });
}
