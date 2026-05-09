import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isLikelyDuplicateContact(error: { message?: string } | null): boolean {
  if (!error?.message) return false;
  const m = error.message.toLowerCase();
  return (
    m.includes("already") ||
    m.includes("duplicate") ||
    m.includes("exists") ||
    m.includes("unique")
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const templateId =
    process.env.RESEND_WELCOME_TEMPLATE_ID ?? "welcome-email";

  if (!apiKey || !from) {
    return Response.json(
      { error: "Newsletter is not configured." },
      { status: 500 }
    );
  }

  if (!segmentId && !audienceId) {
    return Response.json(
      {
        error:
          "Newsletter audience is not configured. Set RESEND_SEGMENT_ID or RESEND_AUDIENCE_ID.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw =
    body &&
    typeof body === "object" &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email
      : "";

  const email = raw.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);

  const contactPayload =
    segmentId != null && segmentId !== ""
      ? {
          email,
          unsubscribed: false as const,
          segments: [{ id: segmentId }],
        }
      : {
          audienceId: audienceId as string,
          email,
          unsubscribed: false as const,
        };

  const { error: contactError } = await resend.contacts.create(contactPayload);

  let alreadySubscribed = false;
  if (contactError) {
    if (isLikelyDuplicateContact(contactError)) {
      alreadySubscribed = true;
    } else {
      return Response.json(
        { error: contactError.message ?? "Could not subscribe." },
        { status: 400 }
      );
    }
  }

  if (!alreadySubscribed) {
    const { error: emailError } = await resend.emails.send({
      from,
      to: email,
      template: {
        id: templateId,
        variables: {},
      },
    });

    if (emailError) {
      return Response.json(
        {
          error:
            emailError.message ??
            "You were added to the list, but the welcome email could not be sent.",
        },
        { status: 502 }
      );
    }
  }

  return Response.json({
    ok: true as const,
    alreadySubscribed,
  });
}
