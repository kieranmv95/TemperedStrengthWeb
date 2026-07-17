export type PromoCodeRow = {
  id: string;
  code: string;
  max_redemptions: number;
  remaining_redemptions: number;
  days_granted: number;
  password_hash: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PromoCodeRedemptionRow = {
  id: string;
  promo_code_id: string;
  email: string;
  redeemed_at: string;
  days_granted: number;
};

export type AdminPromoCode = {
  id: string;
  code: string;
  maxRedemptions: number;
  remainingRedemptions: number;
  daysGranted: number;
  hasPassword: boolean;
  isActive: boolean;
  createdAt: string;
};

export type AdminPromoRedemption = {
  id: string;
  email: string;
  redeemedAt: string;
  daysGranted: number;
  code: string;
};

export type PromoValidateSuccess = {
  ok: true;
  requiresPassword: boolean;
  daysGranted: number;
};

export type PromoRedeemSuccess = {
  ok: true;
  daysGranted: number;
};

export type PromoErrorCode =
  | "invalid_code"
  | "exhausted"
  | "requires_password"
  | "invalid_password"
  | "already_redeemed"
  | "invalid_email";

export type PromoError = {
  ok: false;
  error: PromoErrorCode;
  message: string;
};
