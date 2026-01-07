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
      from: "Waitlist <hello@yourdomain.com>",
      to: email,
      subject: "Welcome!",
      html: "<p>You are officially on the list.</p>",
    });

    return { success: true, message: "Check your inbox!" };
  } catch (e) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
