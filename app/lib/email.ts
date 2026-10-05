import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const result = await resend.emails.send({
      from: "All Apartments online <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", result);

    return result;
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    throw error;
  }
}