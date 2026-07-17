import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AdminPromoCode,
  AdminPromoRedemption,
  PromoCodeRedemptionRow,
  PromoCodeRow,
} from "./types";

function requireAdminClient() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Admin access is not configured.");
  }
  return admin;
}

function mapPromoCode(row: PromoCodeRow): AdminPromoCode {
  return {
    id: row.id,
    code: row.code,
    maxRedemptions: row.max_redemptions,
    remainingRedemptions: row.remaining_redemptions,
    daysGranted: row.days_granted,
    hasPassword: Boolean(row.password_hash),
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function fetchAdminPromoCodes(): Promise<AdminPromoCode[]> {
  const admin = requireAdminClient();

  const { data, error } = await admin
    .from("promo_codes")
    .select(
      "id, code, max_redemptions, remaining_redemptions, days_granted, password_hash, is_active, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as PromoCodeRow[]).map(mapPromoCode);
}

export async function fetchPromoCodeRedemptions(
  promoCodeId: string
): Promise<AdminPromoRedemption[]> {
  const admin = requireAdminClient();

  const { data, error } = await admin
    .from("promo_code_redemptions")
    .select("id, email, redeemed_at, days_granted, promo_codes(code)")
    .eq("promo_code_id", promoCodeId)
    .order("redeemed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const codeRelation = row.promo_codes as { code: string } | { code: string }[] | null;
    const code = Array.isArray(codeRelation)
      ? codeRelation[0]?.code ?? ""
      : codeRelation?.code ?? "";

    return {
      id: row.id as string,
      email: row.email as string,
      redeemedAt: row.redeemed_at as string,
      daysGranted: row.days_granted as number,
      code,
    };
  });
}

export async function fetchRedemptionsByEmail(
  email: string
): Promise<AdminPromoRedemption[]> {
  const admin = requireAdminClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await admin
    .from("promo_code_redemptions")
    .select("id, email, redeemed_at, days_granted, promo_codes(code)")
    .eq("email", normalizedEmail)
    .order("redeemed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const codeRelation = row.promo_codes as { code: string } | { code: string }[] | null;
    const code = Array.isArray(codeRelation)
      ? codeRelation[0]?.code ?? ""
      : codeRelation?.code ?? "";

    return {
      id: row.id as string,
      email: row.email as string,
      redeemedAt: row.redeemed_at as string,
      daysGranted: row.days_granted as number,
      code,
    };
  });
}

export async function fetchAllPromoRedemptions(): Promise<
  Record<string, AdminPromoRedemption[]>
> {
  const admin = requireAdminClient();

  const { data, error } = await admin
    .from("promo_code_redemptions")
    .select("id, promo_code_id, email, redeemed_at, days_granted, promo_codes(code)")
    .order("redeemed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const grouped: Record<string, AdminPromoRedemption[]> = {};

  for (const row of data ?? []) {
    const promoCodeId = row.promo_code_id as string;
    const codeRelation = row.promo_codes as { code: string } | { code: string }[] | null;
    const code = Array.isArray(codeRelation)
      ? codeRelation[0]?.code ?? ""
      : codeRelation?.code ?? "";

    const redemption: AdminPromoRedemption = {
      id: row.id as string,
      email: row.email as string,
      redeemedAt: row.redeemed_at as string,
      daysGranted: row.days_granted as number,
      code,
    };

    if (!grouped[promoCodeId]) {
      grouped[promoCodeId] = [];
    }
    grouped[promoCodeId].push(redemption);
  }

  return grouped;
}

export async function insertPromoCode(input: {
  code: string;
  maxRedemptions: number;
  daysGranted: number;
  passwordHash: string | null;
}): Promise<void> {
  const admin = requireAdminClient();

  const { error } = await admin.from("promo_codes").insert({
    code: input.code,
    max_redemptions: input.maxRedemptions,
    remaining_redemptions: input.maxRedemptions,
    days_granted: input.daysGranted,
    password_hash: input.passwordHash,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("A code with that name already exists.");
    }
    throw new Error(error.message);
  }
}

export async function deletePromoCode(id: string): Promise<void> {
  const admin = requireAdminClient();

  const { data, error: fetchError } = await admin
    .from("promo_codes")
    .select("max_redemptions, remaining_redemptions")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!data) {
    throw new Error("Code not found.");
  }

  if (data.remaining_redemptions !== data.max_redemptions) {
    throw new Error("Codes with redemptions cannot be deleted. Deactivate instead.");
  }

  const { error } = await admin.from("promo_codes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deactivatePromoCode(id: string): Promise<void> {
  const admin = requireAdminClient();

  const { error } = await admin
    .from("promo_codes")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export type PromoCodeLookup = PromoCodeRow;

export async function fetchPromoCodeByCode(code: string): Promise<PromoCodeLookup | null> {
  const admin = createAdminClient();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as PromoCodeLookup | null) ?? null;
}

export async function redeemPromoCodeRecord(input: {
  promoCodeId: string;
  email: string;
  daysGranted: number;
}): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Promo codes are not configured.");
  }

  const { error } = await admin.rpc("redeem_promo_code", {
    p_promo_code_id: input.promoCodeId,
    p_email: input.email,
    p_days_granted: input.daysGranted,
  });

  if (error) {
    if (error.message.includes("already_redeemed")) {
      throw new Error("already_redeemed");
    }
    if (error.message.includes("exhausted")) {
      throw new Error("exhausted");
    }
    throw new Error(error.message);
  }
}

export type { PromoCodeRedemptionRow };
