import { supabase, setRememberMe } from "../lib/supabaseClient";

function mapUser(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    nombre: meta.nombre || "",
    apellido: meta.apellido || "",
    fechaNacimiento: meta.fecha_nacimiento || "",
    semanaEmbarazo: meta.semana_embarazo ?? null,
    celular: meta.celular || "",
    email: user.email,
    proveedor: user.app_metadata?.provider || "email",
  };
}

async function postJson(url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: data.error || "Ocurrió un error. Intentá de nuevo." };
  }
  return { ok: true, ...data };
}

export async function signup({
  nombre,
  apellido,
  fechaNacimiento,
  semanaEmbarazo,
  celular,
  email,
  password,
}) {
  if (
    !nombre?.trim() ||
    !apellido?.trim() ||
    !fechaNacimiento ||
    !semanaEmbarazo ||
    !celular?.trim() ||
    !email?.trim() ||
    !password
  ) {
    return { ok: false, error: "Completá todos los campos." };
  }
  const result = await postJson("/api/auth/send-verification-code", { email: email.trim() });
  if (!result.ok) {
    return result;
  }
  return { ok: true, needsVerification: true, email: email.trim() };
}

export async function verifySignupCode({
  nombre,
  apellido,
  fechaNacimiento,
  semanaEmbarazo,
  celular,
  email,
  password,
  code,
}) {
  if (!code?.trim()) {
    return { ok: false, error: "Ingresá el código." };
  }
  const result = await postJson("/api/auth/verify-and-signup", {
    nombre,
    apellido,
    fecha_nacimiento: fechaNacimiento,
    semana_embarazo: semanaEmbarazo,
    celular,
    email: email.trim(),
    password,
    code: code.trim(),
  });
  if (!result.ok) {
    return result;
  }

  setRememberMe(true);
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    return { ok: false, error: "Cuenta creada. Iniciá sesión con tu email y contraseña." };
  }
  const { data } = await supabase.auth.getSession();
  return { ok: true, user: mapUser(data.session?.user) };
}

export async function resendSignupCode({ email }) {
  return postJson("/api/auth/send-verification-code", { email: email.trim() });
}

export async function login({ email, password, remember = true }) {
  if (!email?.trim() || !password) {
    return { ok: false, error: "Completá email y contraseña." };
  }
  setRememberMe(remember);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }
  return { ok: true, user: mapUser(data.user) };
}

export async function loginWithGoogle({ remember = true } = {}) {
  setRememberMe(remember);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    return { ok: false, error: "No se pudo continuar con Google. Intentá de nuevo." };
  }
  return { ok: true };
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return mapUser(data.session?.user);
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCuenta() {
  const { data } = await supabase.auth.getSession();
  return mapUser(data.session?.user);
}

export async function updateCuenta({ nombre, apellido, fechaNacimiento, celular }) {
  if (!nombre?.trim() || !apellido?.trim()) {
    return { ok: false, error: "Nombre y apellido son obligatorios." };
  }
  const { data, error } = await supabase.auth.updateUser({
    data: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      fecha_nacimiento: fechaNacimiento || "",
      celular: celular?.trim() || "",
    },
  });
  if (error) {
    return { ok: false, error: "No se pudieron guardar los cambios. Intentá de nuevo." };
  }
  return { ok: true, user: mapUser(data.user) };
}

export async function changePassword({ email, actual, nueva }) {
  if (!actual || !nueva) {
    return { ok: false, error: "Completá la contraseña actual y la nueva." };
  }
  // Supabase no pide la contraseña actual para cambiarla; la verificamos
  // re-autenticando para que alguien con la sesión abierta no pueda cambiarla.
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password: actual });
  if (authError) {
    return { ok: false, error: "La contraseña actual no es correcta." };
  }
  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (error) {
    const same = /different|same/i.test(error.message);
    return {
      ok: false,
      error: same ? "La nueva contraseña tiene que ser distinta a la actual." : "No se pudo cambiar la contraseña.",
    };
  }
  return { ok: true };
}

export async function requestEmailChange({ email }) {
  if (!email?.trim()) {
    return { ok: false, error: "Ingresá el nuevo email." };
  }
  return postJson("/api/auth/send-verification-code", { email: email.trim() });
}

export async function confirmEmailChange({ email, code }) {
  if (!code?.trim()) {
    return { ok: false, error: "Ingresá el código." };
  }
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const result = await postJson(
    "/api/auth/verify-and-signup",
    { mode: "change-email", email: email.trim(), code: code.trim() },
    token ? { Authorization: `Bearer ${token}` } : {}
  );
  if (!result.ok) return result;
  const { data: refreshed } = await supabase.auth.refreshSession();
  return { ok: true, user: mapUser(refreshed.session?.user) };
}
