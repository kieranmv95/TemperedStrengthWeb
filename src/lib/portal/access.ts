import type { PortalEntityStatus } from "./types";

export function canAccessApprovedDashboard(status: PortalEntityStatus) {
  return status === "approved";
}

export function canSubmitForReview(status: PortalEntityStatus) {
  return status === "draft" || status === "rejected";
}

export function canDeleteEntity(status: PortalEntityStatus) {
  return status === "draft";
}

export function statusLabel(status: PortalEntityStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "pending":
      return "Pending review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
  }
}
