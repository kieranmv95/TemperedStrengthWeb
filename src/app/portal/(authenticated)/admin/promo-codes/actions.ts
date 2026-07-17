"use server";

import { revalidatePath } from "next/cache";
import { requirePortalAdmin } from "@/lib/portal/adminAccess";
import {
  deactivatePromoCode,
  deletePromoCode,
  insertPromoCode,
} from "@/lib/promoCodes/adminData";
import { hashPassword } from "@/lib/promoCodes/password";
import { parsePromoCodeFromForm } from "@/lib/promoCodes/validation";

export type PromoCodeActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidatePromoPaths() {
  revalidatePath("/portal/admin/promo-codes");
}

export async function createPromoCode(
  formData: FormData
): Promise<PromoCodeActionResult> {
  await requirePortalAdmin();

  try {
    const parsed = parsePromoCodeFromForm(formData);
    const passwordHash = parsed.password ? hashPassword(parsed.password) : null;

    await insertPromoCode({
      code: parsed.code,
      maxRedemptions: parsed.maxRedemptions,
      daysGranted: parsed.daysGranted,
      passwordHash,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not create code.",
    };
  }

  revalidatePromoPaths();
  return { ok: true };
}

export async function deletePromoCodeAction(
  id: string
): Promise<PromoCodeActionResult> {
  await requirePortalAdmin();

  try {
    await deletePromoCode(id);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not delete code.",
    };
  }

  revalidatePromoPaths();
  return { ok: true };
}

export async function deactivatePromoCodeAction(
  id: string
): Promise<PromoCodeActionResult> {
  await requirePortalAdmin();

  try {
    await deactivatePromoCode(id);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not deactivate code.",
    };
  }

  revalidatePromoPaths();
  return { ok: true };
}
