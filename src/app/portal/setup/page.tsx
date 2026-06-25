import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { savePortalDisplayName } from "@/app/portal/actions";
import { createClient } from "@/lib/supabase/server";
import {
  ensurePortalProfile,
  needsDisplayName,
} from "@/lib/portal/profile";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PortalSetupPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const profile = await ensurePortalProfile(user.id);

  if (!needsDisplayName(profile)) {
    redirect("/portal");
  }

  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-8 sm:px-6">
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
        <Link href="/portal" className="inline-flex">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={150}
            height={42}
            className="h-10 w-auto opacity-90"
          />
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
          Welcome
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">What should we call you?</h1>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
          This can be your personal name or your gym, club, or coaching business
          name — whatever you&apos;d like us to use in the portal. It isn&apos;t
          shown publicly anywhere; it&apos;s only for your account here.
        </p>

        <form action={savePortalDisplayName} className="mt-6 space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">
              Your name
            </span>
            <input
              type="text"
              name="display_name"
              required
              autoFocus
              maxLength={100}
              placeholder="e.g. Alex or Ironworks Gym"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] transition-colors"
          >
            Continue to portal
          </button>
        </form>

        <p className="mt-4 break-all text-center text-xs text-neutral-600">
          Signed in as {user.email}
        </p>
      </div>
    </main>
  );
}
