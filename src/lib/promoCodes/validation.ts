const CODE_PATTERN = /^[A-Z0-9_-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireText(value: FormDataEntryValue | null, label: string, max: number): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }
  if (trimmed.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }
  return trimmed;
}

function parsePositiveInt(value: FormDataEntryValue | null, label: string): number {
  const raw = String(value ?? "").trim();
  if (!raw) {
    throw new Error(`${label} is required.`);
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive whole number.`);
  }

  return parsed;
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validatePromoCodeFormat(code: string): void {
  const normalized = normalizePromoCode(code);
  if (normalized.length < 2 || normalized.length > 32) {
    throw new Error("Code must be between 2 and 32 characters.");
  }
  if (!CODE_PATTERN.test(normalized)) {
    throw new Error("Code may only contain letters, numbers, hyphens, and underscores.");
  }
}

export function validateEmailFormat(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length <= 320 && EMAIL_PATTERN.test(normalized);
}

export function parsePromoCodeFromForm(formData: FormData) {
  const code = normalizePromoCode(requireText(formData.get("code"), "Code", 32));
  validatePromoCodeFormat(code);

  const maxRedemptions = parsePositiveInt(formData.get("max_redemptions"), "Max redemptions");
  const daysGranted = parsePositiveInt(formData.get("days_granted"), "Days granted");
  const password = String(formData.get("password") ?? "").trim();

  if (password.length > 128) {
    throw new Error("Password must be 128 characters or fewer.");
  }

  return {
    code,
    maxRedemptions,
    daysGranted,
    password: password || null,
  };
}

export function parseValidateRequest(body: unknown): { code: string } {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body.");
  }

  const code = normalizePromoCode(
    requireText((body as { code?: unknown }).code as FormDataEntryValue | null, "Code", 32)
  );
  validatePromoCodeFormat(code);

  return { code };
}

export function parseRedeemRequest(body: unknown): {
  code: string;
  email: string;
  password: string | null;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body.");
  }

  const payload = body as {
    code?: unknown;
    email?: unknown;
    password?: unknown;
  };

  const code = normalizePromoCode(
    requireText(payload.code as FormDataEntryValue | null, "Code", 32)
  );
  validatePromoCodeFormat(code);

  const email = normalizeEmail(
    requireText(payload.email as FormDataEntryValue | null, "Email", 320)
  );

  if (!validateEmailFormat(email)) {
    throw new Error("Invalid email address.");
  }

  const password =
    payload.password == null || payload.password === ""
      ? null
      : String(payload.password);

  if (password && password.length > 128) {
    throw new Error("Password must be 128 characters or fewer.");
  }

  return { code, email, password };
}
