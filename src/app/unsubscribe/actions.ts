"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function unsubscribeAction(
  prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;

  try {
    // This updates the contact status to "Unsubscribed" in your Resend dashboard
    await resend.contacts.update({
      email: email,
      unsubscribed: true,
    });

    // Redirect or return success
    return { success: true, message: "Unsubscribed successfully." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to unsubscribe." };
  }
}
