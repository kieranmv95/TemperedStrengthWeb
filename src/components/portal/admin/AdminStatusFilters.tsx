import Link from "next/link";
import type { PortalEntityStatus } from "@/lib/portal/types";

const FILTERS: { value: PortalEntityStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
];

type Props = {
  basePath: string;
  current: PortalEntityStatus | "all";
};

export function AdminStatusFilters({ basePath, current }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label }) => {
        const active = current === value;
        const href = value === "all" ? basePath : `${basePath}?status=${value}`;

        return (
          <Link
            key={value}
            href={href}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? "border-[#FFBA6F]/40 bg-[#FFBA6F]/10 text-[#FFCA91]"
                : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
