import { redirect } from "next/navigation";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { createClient } from "@/lib/supabase/server";
import {
  ensurePortalProfile,
  needsDisplayName,
} from "@/lib/portal/profile";

export default async function AuthenticatedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await ensurePortalProfile(user.id);
    if (needsDisplayName(profile)) {
      redirect("/portal/setup");
    }
  }

  return (
    <>
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}
