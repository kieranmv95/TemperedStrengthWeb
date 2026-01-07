// app/actions.ts
"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeUser(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;

  try {
    await resend.contacts.create({
      email: email,
      unsubscribed: false,
    });

    await resend.emails.send({
      from: "Waitlist - Tempered Strength - No Reply <hello@temperedstrength.com>", // Must be a verified domain
      to: email,
      subject: "You're in! Welcome to the waitlist!",
      headers: {
        "List-Unsubscribe": "<https://temperedstrength.com/unsubscribe>",
      },
      html: `
        <h1>You're in! Welcome to the waitlist!</h1>
        <p>Thanks for signing up. We'll notify you as soon as we launch.</p>
        <hr />
        <br />
        <p style="font-size: 12px; color: #666;">
          Don't want these emails?
          <a href="https://temperedstrength.com/unsubscribe">Unsubscribe here</a>
        </p>
      `,
    });

    return { success: true, message: "Check your inbox!" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong." };
  }
}
