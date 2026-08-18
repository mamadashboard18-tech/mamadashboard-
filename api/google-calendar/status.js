import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { getUserFromRequest } from "../_lib/googleCalendar.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const user = await getUserFromRequest(req, supabaseAdmin);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  if (req.method === "POST") {
    // Desconectar: POST a este mismo endpoint borra el token guardado.
    await supabaseAdmin.from("google_calendar_tokens").delete().eq("user_id", user.id);
    res.status(200).json({ success: true });
    return;
  }

  const { data } = await supabaseAdmin
    .from("google_calendar_tokens")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  res.status(200).json({ connected: !!data });
}
