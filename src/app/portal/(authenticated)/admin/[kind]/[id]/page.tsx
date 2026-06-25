import { notFound } from "next/navigation";
import { AdminEntityReview } from "@/components/portal/admin/AdminEntityReview";
import { isPortalEntityKind } from "@/lib/portal/constants";
import { fetchAdminEntity, fetchOwnerInfo } from "@/lib/portal/adminData";

type Props = {
  params: Promise<{ kind: string; id: string }>;
  searchParams: Promise<{
    approved?: string;
    rejected?: string;
    error?: string;
  }>;
};

export default async function AdminEntityDetailPage({
  params,
  searchParams,
}: Props) {
  const { kind: kindParam, id } = await params;
  const { approved, rejected, error } = await searchParams;

  if (!isPortalEntityKind(kindParam)) {
    notFound();
  }

  const kind = kindParam;
  const { entity, error: loadError } = await fetchAdminEntity(kind, id);

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
        Could not load listing: {loadError}
      </div>
    );
  }

  if (!entity) {
    notFound();
  }

  const owner = await fetchOwnerInfo(entity.owner_id);

  return (
    <AdminEntityReview
      kind={kind}
      entity={entity}
      owner={owner}
      approved={approved === "1"}
      rejected={rejected === "1"}
      error={error ? decodeURIComponent(error) : undefined}
    />
  );
}
