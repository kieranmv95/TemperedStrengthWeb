import { requirePortalAdminAreaAccess } from "@/lib/portal/adminAccess";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePortalAdminAreaAccess();

  return <div className="min-w-0">{children}</div>;
}
