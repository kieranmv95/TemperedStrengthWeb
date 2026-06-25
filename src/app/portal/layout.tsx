import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Portal | Tempered Strength",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      {children}
    </div>
  );
}
