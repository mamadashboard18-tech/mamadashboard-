import { supabase } from "../lib/supabaseClient";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getGoogleCalendarStatus() {
  const headers = await authHeaders();
  const res = await fetch("/api/google-calendar/status", { headers });
  if (!res.ok) return { connected: false };
  return res.json();
}

export async function connectGoogleCalendar() {
  const headers = await authHeaders();
  const res = await fetch("/api/google-calendar/auth-url", { headers });
  if (!res.ok) return;
  const { url } = await res.json();
  window.location.href = url;
}

export async function disconnectGoogleCalendar() {
  const headers = await authHeaders();
  await fetch("/api/google-calendar/disconnect", { method: "POST", headers });
}

export async function getGoogleCalendarEvents(dateISO) {
  const headers = await authHeaders();
  const res = await fetch(`/api/google-calendar/busy?date=${dateISO}`, { headers });
  if (!res.ok) return { connected: false, events: [] };
  return res.json();
}

export async function getUpcomingGoogleCalendarEvents() {
  const headers = await authHeaders();
  const res = await fetch("/api/google-calendar/upcoming", { headers });
  if (!res.ok) return { connected: false, events: [] };
  return res.json();
}

export async function createGoogleCalendarEvent(cita) {
  const headers = await authHeaders();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = await fetch("/api/google-calendar/create-event", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ ...cita, timeZone }),
  });
  if (!res.ok) return { created: false };
  return res.json();
}
