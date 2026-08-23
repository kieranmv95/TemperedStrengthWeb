import Link from "next/link";
import { PromoCodeCreateForm } from "@/components/portal/admin/promoCodes/PromoCodeCreateForm";
import { PromoCodeList } from "@/components/portal/admin/promoCodes/PromoCodeList";
import { PromoEmailSearch } from "@/components/portal/admin/promoCodes/PromoEmailSearch";
import { requirePortalAdmin } from "@/lib/portal/adminAccess";
import {
  fetchAdminPromoCodes,
  fetchAllPromoRedemptions,
  fetchRedemptionsByEmail,
} from "@/lib/promoCodes/adminData";
import { normalizeEmail } from "@/lib/promoCodes/validation";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function AdminPromoCodesPage({ searchParams }: PageProps) {
  await requirePortalAdmin();
  const params = await searchParams;
  const searchEmail = params.email?.trim() ? normalizeEmail(params.email) : undefined;

  const [codes, redemptionsByCodeId, emailResults] = await Promise.all([
    fetchAdminPromoCodes(),
    fetchAllPromoRedemptions(),
    searchEmail ? fetchRedemptionsByEmail(searchEmail) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/portal/admin"
          className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
        >
          ← Partner review
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
          Admin · Promo codes
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Promo codes</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Create codes for the app to redeem time-limited Pro access. Redemptions
          require an email for audit.
        </p>
      </div>

      <PromoCodeCreateForm />

      <PromoEmailSearch
        email={searchEmail}
        results={emailResults.map((result) => ({
          email: result.email,
          code: result.code,
          redeemedAt: result.redeemedAt,
          daysGranted: result.daysGranted,
        }))}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">All codes</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Unused codes can be deleted. Codes with redemptions can only be deactivated.
          </p>
        </div>

        <PromoCodeList codes={codes} redemptionsByCodeId={redemptionsByCodeId} />
      </section>
    </div>
  );
}
