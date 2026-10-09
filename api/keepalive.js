import { getSupabaseAdmin } from "./_lib/supabaseAdmin.js";

// Supabase (plan gratis) pausa el proyecto tras ~7 días sin actividad. Vercel Cron llama a
// este endpoint una vez por día (ver vercel.json) y hace una consulta mínima para que
// siempre haya actividad. Vercel manda Authorization: Bearer <CRON_SECRET> automáticamente.
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    res.status(401).json({ error: "No autorizado." });
    return;
  }

  const { error } = await getSupabaseAdmin().from("profiles").select("id").limit(1);
  if (error) {
    res.status(500).json({ error: "No se pudo consultar Supabase." });
    return;
  }

  res.status(200).json({ ok: true, at: new Date().toISOString() });
}
