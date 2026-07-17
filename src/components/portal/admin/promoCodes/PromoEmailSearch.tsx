type Props = {
  email?: string;
  results: Array<{
    email: string;
    code: string;
    redeemedAt: string;
    daysGranted: number;
  }>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PromoEmailSearch({ email, results }: Props) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
      <div>
        <p className="text-sm font-semibold text-white">Search by email</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          Look up all redemptions for a suspect email across every code.
        </p>
      </div>

      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          defaultValue={email ?? ""}
          required
          placeholder="user@example.com"
          className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:border-[#c9b072]/40 transition-colors"
        >
          Search
        </button>
      </form>

      {email ? (
        results.length === 0 ? (
          <p className="text-sm text-neutral-500">No redemptions found for {email}.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {results.length} redemption{results.length === 1 ? "" : "s"} for {email}
            </p>
            {results.map((result, index) => (
              <div
                key={`${result.code}-${result.redeemedAt}-${index}`}
                className="flex flex-col gap-0.5 rounded-md border border-neutral-800/80 bg-neutral-950/40 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-mono text-neutral-200">{result.code}</span>
                <span className="text-xs text-neutral-500">
                  {formatDate(result.redeemedAt)} · {result.daysGranted} days
                </span>
              </div>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}
