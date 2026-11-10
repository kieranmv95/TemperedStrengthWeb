import Link from "next/link";
import {
  isPortalAdmin,
  requirePortalAdminAreaAccess,
} from "@/lib/portal/adminAccess";

function LiveCompetitionCard() {
  return (
    <Link
      href="/portal/competition"
      className="block rounded-xl border border-[#FFBA6F]/30 bg-[#FFBA6F]/10 p-4 transition-colors hover:border-[#FFBA6F]/50 sm:p-5"
    >
      <p className="text-sm font-semibold text-[#FFCA91]">
        Live competition board
      </p>
      <p className="mt-2 text-sm text-neutral-300">
        Add and remove leaderboard scores during the event. Changes go live in
        the app within about 30 seconds.
      </p>
    </Link>
  );
}

function PromoCodesCard() {
  return (
    <Link
      href="/portal/promo-codes"
      className="block rounded-xl border border-[#FFBA6F]/30 bg-[#FFBA6F]/10 p-4 transition-colors hover:border-[#FFBA6F]/50 sm:p-5"
    >
      <p className="text-sm font-semibold text-[#FFCA91]">Promo codes</p>
      <p className="mt-2 text-sm text-neutral-300">
        Create and manage Pro redemption codes for the app, with email audit
        logging.
      </p>
    </Link>
  );
}

export default async function PortalHomePage() {
  const { profile } = await requirePortalAdminAreaAccess();
  const isAdmin = isPortalAdmin(profile);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFBA6F]">
          Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {isAdmin ? "Tempered Strength admin" : "Live competition board"}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          {isAdmin
            ? "Run the live competition board and manage promo codes for the app."
            : "Event staff access — add athletes and scores as they come in."}
        </p>
      </div>

      <div className="grid gap-3">
        <LiveCompetitionCard />
        {isAdmin ? <PromoCodesCard /> : null}
      </div>
    </div>
  );
}
