import {
  fetchPromoCodeByCode,
  redeemPromoCodeRecord,
} from "./adminData";
import { verifyPassword } from "./password";
import type {
  PromoError,
  PromoRedeemSuccess,
  PromoValidateSuccess,
} from "./types";

function promoError(
  error: PromoError["error"],
  message: string
): PromoError {
  return { ok: false, error, message };
}

export async function validatePromoCode(
  code: string
): Promise<PromoValidateSuccess | PromoError> {
  let row: Awaited<ReturnType<typeof fetchPromoCodeByCode>>;

  try {
    row = await fetchPromoCodeByCode(code);
  } catch {
    return promoError("invalid_code", "Could not validate code.");
  }

  if (!row || !row.is_active) {
    return promoError("invalid_code", "Code not found or inactive.");
  }

  if (row.remaining_redemptions <= 0) {
    return promoError("exhausted", "This code has no remaining redemptions.");
  }

  return {
    ok: true,
    requiresPassword: Boolean(row.password_hash),
    daysGranted: row.days_granted,
  };
}

export async function redeemPromoCode(input: {
  code: string;
  email: string;
  password: string | null;
}): Promise<PromoRedeemSuccess | PromoError> {
  let row: Awaited<ReturnType<typeof fetchPromoCodeByCode>>;

  try {
    row = await fetchPromoCodeByCode(input.code);
  } catch {
    return promoError("invalid_code", "Could not redeem code.");
  }

  if (!row || !row.is_active) {
    return promoError("invalid_code", "Code not found or inactive.");
  }

  if (row.remaining_redemptions <= 0) {
    return promoError("exhausted", "This code has no remaining redemptions.");
  }

  if (row.password_hash) {
    if (!input.password) {
      return promoError("requires_password", "This code requires a password.");
    }
    if (!verifyPassword(input.password, row.password_hash)) {
      return promoError("invalid_password", "Incorrect password.");
    }
  }

  try {
    await redeemPromoCodeRecord({
      promoCodeId: row.id,
      email: input.email,
      daysGranted: row.days_granted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not redeem code.";

    if (message === "already_redeemed") {
      return promoError(
        "already_redeemed",
        "This email has already redeemed this code."
      );
    }
    if (message === "exhausted") {
      return promoError("exhausted", "This code has no remaining redemptions.");
    }

    return promoError("invalid_code", message);
  }

  return {
    ok: true,
    daysGranted: row.days_granted,
  };
}
