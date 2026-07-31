import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest, getValidAccessToken } from "../_lib/googleCalendar.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const user = await getUserFromRequest(req, supabaseAdmin);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  const { fecha, hora, tipo, medico, lugar, preguntas, notas, timeZone } = req.body || {};
  if (!fecha || !tipo) {
    res.status(400).json({ error: "Datos de cita inválidos." });
    return;
  }

  const accessToken = await getValidAccessToken(user.id, supabaseAdmin);
  if (!accessToken) {
    res.status(200).json({ created: false, reason: "not_connected" });
    return;
  }

  const summary = medico ? `${tipo} con ${medico}` : tipo;
  const description = [
    medico && `Médico/profesional: ${medico}`,
    preguntas && `Preguntas: ${preguntas}`,
    notas && `Notas: ${notas}`,
  ]
    .filter(Boolean)
    .join("\n");

  let event;
  if (hora) {
    const start = new Date(`${fecha}T${hora}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}:00`;
    event = {
      summary,
      description: description || undefined,
      location: lugar || undefined,
      start: { dateTime: fmt(start), timeZone: timeZone || undefined },
      end: { dateTime: fmt(end), timeZone: timeZone || undefined },
    };
  } else {
    const end = new Date(`${fecha}T00:00:00`);
    end.setDate(end.getDate() + 1);
    const endISO = end.toISOString().slice(0, 10);
    event = {
      summary,
      description: description || undefined,
      location: lugar || undefined,
      start: { date: fecha },
      end: { date: endISO },
    };
  }

  const gRes = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!gRes.ok) {
    res.status(200).json({ created: false, reason: "google_error" });
    return;
  }

  const data = await gRes.json();
  res.status(200).json({ created: true, eventId: data.id, htmlLink: data.htmlLink });
}
