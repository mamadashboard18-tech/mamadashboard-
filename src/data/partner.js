import { supabase } from "../lib/supabaseClient";

function buildInviteUrl(token) {
  return `${window.location.origin}/?partner_invite=${token}`;
}

async function authFetch(url, options = {}) {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: body.error || "Ocurrió un error. Intentá de nuevo." };
  }
  return { ok: true, ...body };
}

// ---------- Lado mamá ----------

// La vista previa del dashboard (solo en desarrollo) corre sin sesión: simulamos
// un partner vinculado para poder ver los controles de compartir. Las funciones
// de sync ya no escriben nada sin usuario, así que no se toca Supabase.
const PARTNER_SIMULADO = { hasPartner: true, nombre: "Martín (simulado)", email: "partner@ejemplo.com", pendingInvite: null };

export async function getPartnerStatus() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return import.meta.env.DEV ? PARTNER_SIMULADO : { hasPartner: false, pendingInvite: null };
  }

  const { data: partner } = await supabase
    .from("partners")
    .select("nombre, email")
    .eq("mother_id", userData.user.id)
    .maybeSingle();

  if (partner) {
    return { hasPartner: true, nombre: partner.nombre, email: partner.email, pendingInvite: null };
  }

  const { data: invites } = await supabase
    .from("partner_invites")
    .select("token, expires_at")
    .eq("mother_id", userData.user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  const invite = invites?.[0];
  if (invite && new Date(invite.expires_at).getTime() > Date.now()) {
    return {
      hasPartner: false,
      pendingInvite: { token: invite.token, url: buildInviteUrl(invite.token), expiresAt: invite.expires_at },
    };
  }

  return { hasPartner: false, pendingInvite: null };
}

export async function createInvite() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "No autenticado." };

  await supabase
    .from("partner_invites")
    .update({ status: "revoked" })
    .eq("mother_id", userData.user.id)
    .eq("status", "pending");

  const token = crypto.randomUUID();
  const { error } = await supabase
    .from("partner_invites")
    .insert({ mother_id: userData.user.id, token });

  if (error) return { ok: false, error: "No se pudo generar el link. Intentá de nuevo." };
  return { ok: true, url: buildInviteUrl(token) };
}

export async function revokeInvite(token) {
  await supabase.from("partner_invites").update({ status: "revoked" }).eq("token", token);
}

export async function removePartner() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  await supabase.from("partners").delete().eq("mother_id", userData.user.id);
}

export async function sendPartnerNote(texto) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user || !texto?.trim()) return { ok: false };
  const { error } = await supabase
    .from("partner_notes")
    .insert({ mother_id: userData.user.id, texto: texto.trim() });
  return { ok: !error };
}

// Una entrada del diario compartida queda espejada en una sola nota: si ya
// existe se actualiza, si se deja de compartir se borra.
export async function syncNotaDiarioCompartida(noteId, texto) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    if (!import.meta.env.DEV) return noteId || null;
    return texto?.trim() ? noteId || "simulada" : null;
  }

  if (!texto?.trim()) {
    if (noteId) await supabase.from("partner_notes").delete().eq("id", noteId);
    return null;
  }

  if (noteId) {
    const { data } = await supabase
      .from("partner_notes")
      .update({ texto: texto.trim() })
      .eq("id", noteId)
      .select("id");
    if (data?.length) return noteId;
  }

  const { data, error } = await supabase
    .from("partner_notes")
    .insert({ mother_id: userData.user.id, texto: texto.trim() })
    .select("id")
    .single();
  return error ? null : data.id;
}

export async function listPartnerNotes() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data } = await supabase
    .from("partner_notes")
    .select("id, texto, created_at, leida_at")
    .eq("mother_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  return data || [];
}

export async function deleteCitaCompartida(id) {
  await supabase.from("citas_compartidas").delete().eq("id", id);
}

export async function syncCitaCompartida(cita) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  if (!cita.compartirPartner) {
    await deleteCitaCompartida(cita.id);
    return;
  }

  await supabase.from("citas_compartidas").upsert({
    id: cita.id,
    mother_id: userData.user.id,
    fecha: cita.fecha,
    hora: cita.hora || null,
    tipo: cita.tipo,
    medico: cita.medico || null,
    lugar: cita.lugar || null,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchCitasRsvp(ids) {
  if (!ids?.length) return {};
  const { data } = await supabase.from("citas_compartidas").select("id, partner_rsvp").in("id", ids);
  const map = {};
  (data || []).forEach((r) => {
    map[r.id] = r.partner_rsvp;
  });
  return map;
}

export async function syncSintomasCompartidos(fecha, sintomas) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  if (!sintomas || sintomas.length === 0) {
    await supabase
      .from("sintomas_compartidos")
      .delete()
      .eq("mother_id", userData.user.id)
      .eq("fecha", fecha);
    return;
  }

  await supabase.from("sintomas_compartidos").upsert({
    mother_id: userData.user.id,
    fecha,
    sintomas,
    updated_at: new Date().toISOString(),
  });
}

// Reemplaza el espejo completo: sube los contactos marcados para compartir y
// borra los que ya no están (eliminados o dejados de compartir).
export async function syncContactosCompartidos(contactos) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const motherId = userData.user.id;

  const compartidos = contactos.filter((c) => c.compartirPartner ?? true);
  const ids = compartidos.map((c) => c.id);

  let borrar = supabase.from("contactos_compartidos").delete().eq("mother_id", motherId);
  if (ids.length > 0) borrar = borrar.not("id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`);
  await borrar;

  if (compartidos.length === 0) return;
  const updatedAt = new Date().toISOString();
  await supabase.from("contactos_compartidos").upsert(
    compartidos.map((c) => ({
      id: c.id,
      mother_id: motherId,
      nombre: c.nombre,
      rol: c.rol || null,
      telefono: c.telefono || null,
      updated_at: updatedAt,
    }))
  );
}

// ---------- Lado partner ----------

export async function isPartnerSession(userId) {
  if (!userId) return false;
  const { data } = await supabase
    .from("partners")
    .select("mother_id")
    .eq("partner_user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function acceptInvite({ token, nombre, email, password }) {
  if (!nombre?.trim() || !email?.trim() || !password) {
    return { ok: false, error: "Completá todos los campos." };
  }
  const result = await authFetch("/api/partner/accept-invite", {
    method: "POST",
    body: JSON.stringify({ token, nombre: nombre.trim(), email: email.trim(), password }),
  });
  if (!result.ok) return result;

  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    return { ok: false, error: "Cuenta creada. Iniciá sesión con tu email y contraseña." };
  }
  return { ok: true };
}

export async function fetchPartnerData() {
  return authFetch("/api/partner/data");
}

export async function sendRsvp(citaId, respuesta) {
  return authFetch("/api/partner/data", {
    method: "POST",
    body: JSON.stringify({ citaId, respuesta }),
  });
}

export async function getPartnerProfile() {
  return authFetch("/api/partner/profile");
}

export async function updatePartnerProfile({ nombre, notifRecordatoriosEmail, notifNotaEmail }) {
  return authFetch("/api/partner/profile", {
    method: "POST",
    body: JSON.stringify({ nombre, notifRecordatoriosEmail, notifNotaEmail }),
  });
}

export async function updatePartnerPassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: "No se pudo actualizar la contraseña." };
  return { ok: true };
}
