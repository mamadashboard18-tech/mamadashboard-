import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest, getValidAccessToken, listCalendarEvents } from "../_lib/googleCalendar.js";

const WINDOW_DAYS = 180;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const user = await getUserFromRequest(req, supabaseAdmin);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  const accessToken = await getValidAccessToken(user.id, supabaseAdmin);
  if (!accessToken) {
    res.status(200).json({ connected: false, events: [] });
    return;
  }

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const events = await listCalendarEvents(accessToken, timeMin, timeMax);

  res.status(200).json({ connected: true, events: events || [] });
}
