import { requirePortalAdmin } from "@/lib/portal/adminAccess";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePortalAdmin();

  return <div className="min-w-0">{children}</div>;
}
