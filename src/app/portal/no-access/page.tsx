import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/portal/actions";
import { canAccessPortalAdmin } from "@/lib/portal/adminAccess";
import { getPortalProfile } from "@/lib/portal/profile";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function PortalNoAccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const profile = await getPortalProfile(user.id);
  if (canAccessPortalAdmin(profile) && isSupabaseAdminConfigured()) {
    redirect("/portal");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-8 sm:px-6">
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
        <Link href="/" className="inline-flex">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={150}
            height={42}
            className="h-10 w-auto opacity-90"
          />
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#FFBA6F]">
          Portal
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">No access</h1>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
          This portal is for Tempered Strength staff and event teams. Your
          account doesn&apos;t have access. If you think that&apos;s wrong,{" "}
          <a
            href="mailto:contact@localhostdevelopment.com"
            className="text-[#FFBA6F] hover:underline"
          >
            get in touch
          </a>
          .
        </p>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:text-white hover:border-[#FFBA6F]/40 transition-colors"
          >
            Sign out
          </button>
        </form>

        <p className="mt-4 break-all text-center text-xs text-neutral-600">
          Signed in as {user.email}
        </p>
      </div>
    </main>
  );
}
