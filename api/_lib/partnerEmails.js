import { Resend } from "resend";
import { citaInfoPorTipo, citaInfoPorDefecto } from "../../src/data/partnerCitaInfo.js";

export async function sendCitaReminderEmail(to, cita) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no configurada");
  }
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "Mamá App <onboarding@resend.dev>";

  const info = citaInfoPorTipo[cita.tipo] || citaInfoPorDefecto;
  const preguntasHtml = info.preguntasPartner.map((p) => `<li>${p}</li>`).join("");
  const detalleMedico = cita.medico ? ` con ${cita.medico}` : "";
  const detalleLugar = cita.lugar ? ` en ${cita.lugar}` : "";

  const noAsiste = cita.partner_rsvp === "no_puede";

  const html = noAsiste
    ? `
      <p>Hola,</p>
      <p><strong>${cita.motherNombre}</strong> tiene en 30 minutos: <strong>${cita.tipo}</strong>${detalleMedico}${detalleLugar}, a las ${cita.hora}. Marcaste que no ibas a poder ir.</p>
      <p>Acordate de preguntarle más tarde cómo le fue 💛</p>
      <p><strong>De qué se trataba:</strong> ${info.descripcion}</p>
    `
    : `
      <p>Hola,</p>
      <p><strong>${cita.motherNombre}</strong> tiene una cita en 30 minutos: <strong>${cita.tipo}</strong>${detalleMedico}${detalleLugar}, a las ${cita.hora}.</p>
      <p>Es un buen momento para desearle buena suerte 💛</p>
      <p><strong>Qué se va a realizar:</strong> ${info.descripcion}</p>
      <p><strong>Preguntas que podrías hacer si la acompañás:</strong></p>
      <ul>${preguntasHtml}</ul>
    `;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: noAsiste
      ? `En 30 min: ${cita.tipo} de ${cita.motherNombre} (no vas a poder ir)`
      : `En 30 min: ${cita.tipo} de ${cita.motherNombre}`,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
