export const EMAIL_OTP_TYPES = [
  "email",
  "magiclink",
  "signup",
  "invite",
  "recovery",
  "email_change",
] as const;

export type PortalEmailOtpType = (typeof EMAIL_OTP_TYPES)[number];

export function parseEmailOtpType(
  value: string | null | undefined
): PortalEmailOtpType {
  return EMAIL_OTP_TYPES.includes(value as PortalEmailOtpType)
    ? (value as PortalEmailOtpType)
    : "email";
}

export function safePortalNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/portal")) return "/portal";
  if (next.startsWith("//") || next.includes("://")) return "/portal";
  return next;
}

export function portalAuthErrorMessage(message: string | null | undefined): string {
  const detail = (message ?? "").toLowerCase();
  if (detail.includes("code verifier") || detail.includes("flow state")) {
    return "Open the sign-in link in the same browser you used to request it, or enter the code from the email.";
  }
  if (detail.includes("expired")) {
    return "That sign-in link has expired. Request a new one.";
  }
  return "Sign-in link expired or invalid. Please try again.";
}
