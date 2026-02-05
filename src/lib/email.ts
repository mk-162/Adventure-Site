import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLink({
  to,
  operatorName,
  token,
  purpose,
}: {
  to: string;
  operatorName: string;
  token: string;
  purpose: "login" | "claim";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const url = `${baseUrl}/auth/verify?token=${token}`;

  const subject = purpose === "claim"
    ? `Verify your Adventure Wales listing — ${operatorName}`
    : `Sign in to Adventure Wales — ${operatorName}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e3a4c; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0;">Adventure Wales</h1>
      </div>
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="color: #1e3a4c;">${purpose === "claim" ? "Verify Your Listing" : "Sign In"}</h2>
        <p>Hi! Click the button below to ${purpose === "claim" ? "verify and manage" : "access"} the <strong>${operatorName}</strong> listing on Adventure Wales.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #ea580c; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            ${purpose === "claim" ? "Verify My Listing →" : "Sign In →"}
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 48 hours. If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "Adventure Wales <noreply@adventurewales.co.uk>",
    to,
    subject,
    html,
  });
}
