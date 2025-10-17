import sgMail from "@sendgrid/mail";
const key = process.env.SENDGRID_API_KEY;
if (key) sgMail.setApiKey(key);

export async function sendEmail({ to, subject, html }) {
  if (!key) {
    console.warn("SendGrid API key missing; skipping email:", subject, to);
    return null;
  }
  const msg = { to, from: process.env.SENDGRID_FROM || "no-reply@wishhoffrichies.com", subject, html };
  return sgMail.send(msg);
}
