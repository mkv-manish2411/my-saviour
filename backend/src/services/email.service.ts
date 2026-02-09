import { mailer } from "../utils/mailer";

export async function sendEligibilityEmail(
  email: string,
  name: string
) {
  await mailer.sendMail({
    from: `"My Savior" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🩸 You are eligible to donate blood again",
    html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for saving lives ❤️</p>
      <p>You are now <b>eligible to donate blood again</b>.</p>
      <p>If you are available, please visit My Savior.</p>
      <br />
      <p>— Team My Savior</p>
    `,
  });
}
