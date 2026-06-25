import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/app/portal/actions";
import { ensurePortalProfile } from "@/lib/portal/profile";
import { createClient } from "@/lib/supabase/server";

export async function PortalHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await ensurePortalProfile(user.id) : null;
  const displayName = profile?.display_name?.trim();

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/portal" className="inline-flex shrink-0 items-center">
            <Image
              src="/logo_stacked.svg"
              alt="Tempered Strength"
              width={150}
              height={42}
              className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
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

          <nav className="flex items-center gap-3 text-sm font-semibold">
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
