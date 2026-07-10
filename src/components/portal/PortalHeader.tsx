import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/app/portal/actions";
import { isPortalAdminEmail } from "@/lib/portal/adminAccess";
import { ensurePortalProfile } from "@/lib/portal/profile";
import { createClient } from "@/lib/supabase/server";

export async function PortalHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await ensurePortalProfile(user.id) : null;
  const displayName = profile?.display_name?.trim();
  const isAdmin = isPortalAdminEmail(user?.email);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full min-w-0 max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link href="/portal" className="inline-flex shrink-0 items-center">
            <Image
              src="/logo_stacked.svg"
              alt="Tempered Strength"
              width={150}
              height={42}
              className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity sm:h-10"
            />
          </Link>
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Partner portal
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {displayName ? (
            <div
              className="hidden rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 sm:block"
              aria-label={`Signed in as ${displayName}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Signed in as
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white leading-tight">
                {displayName}
              </p>
              {user?.email ? (
                <p className="mt-0.5 text-xs text-neutral-500 truncate max-w-[12rem]">
                  {user.email}
                </p>
              ) : null}
            </div>
          ) : null}

          <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-3">
            {isAdmin ? (
              <>
                <Link
                  href="/portal/admin/competition"
                  className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-2.5 py-2 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors sm:px-3"
                >
                  Competition
                </Link>
                <Link
                  href="/portal/admin"
                  className="rounded-lg border border-[#c9b072]/30 bg-[#c9b072]/10 px-2.5 py-2 text-[#d4c08a] hover:bg-[#c9b072]/20 transition-colors sm:px-3"
                >
                  Admin
                </Link>
              </>
            ) : null}
            <Link
              href="/"
              className="hidden text-neutral-400 hover:text-white transition-colors sm:inline"
            >
              Website
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-neutral-300 hover:text-white hover:border-[#c9b072]/40 transition-colors"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </div>

      {displayName ? (
        <div className="border-t border-neutral-800/80 px-4 py-2.5 sm:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Signed in as
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white">{displayName}</p>
        </div>
      ) : null}
    </header>
  );
}
