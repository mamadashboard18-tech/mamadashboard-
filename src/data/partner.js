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

export async function getPartnerStatus() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { hasPartner: false, pendingInvite: null };

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

export async function listPartnerNotes() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data } = await supabase
    .from("partner_notes")
    .select("id, texto, created_at")
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
  return authFetch("/api/partner/rsvp", {
    method: "POST",
    body: JSON.stringify({ citaId, respuesta }),
  });
}
