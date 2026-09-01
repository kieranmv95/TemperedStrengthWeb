import Link from "next/link";
import { redirect } from "next/navigation";
import { parseEmailOtpType, safePortalNext } from "@/lib/portal/authRedirect";
import ConfirmMagicLinkForm from "./ConfirmMagicLinkForm";

type Props = {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
    next?: string;
  }>;
};

export default async function ConfirmMagicLinkPage({ searchParams }: Props) {
  const params = await searchParams;
  const tokenHash = params.token_hash?.trim();

  if (!tokenHash) {
    redirect("/portal/login?error=auth");
  }

  const type = parseEmailOtpType(params.type);
  const next = safePortalNext(params.next);

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-0 max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="mx-auto w-full min-w-0 max-w-md">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
            Partner portal
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white">Finish signing in</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Click continue to finish signing in.
          </p>

          <ConfirmMagicLinkForm tokenHash={tokenHash} type={type} next={next} />

          <p className="mt-6 text-center text-sm text-neutral-500">
            <Link href="/portal/login" className="text-[#c9b072] hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
