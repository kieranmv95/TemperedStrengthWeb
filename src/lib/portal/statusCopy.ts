import type { PortalEntityStatus } from "./types";

export const APPROVAL_SLA =
  "We manually review every submission and aim to approve accounts within 24 hours.";

export type StatusCopy = {
  title: string;
  body: string;
  nextStep?: string;
};

export function getStatusCopy(
  status: PortalEntityStatus,
  rejectionNote?: string | null
): StatusCopy {
  switch (status) {
    case "approved":
      return {
        title: "Approved",
        body: "Your account is approved. Partner features are unlocked below.",
        nextStep:
          "You can edit your profile at any time — changes save immediately without needing another review.",
      };
    case "pending":
      return {
        title: "Pending approval",
        body: `Your profile has been submitted and is waiting for our team to review it. ${APPROVAL_SLA}`,
        nextStep:
          "You can still edit your profile while you wait. We'll unlock partner tools as soon as you're approved.",
      };
    case "rejected":
      return {
        title: "Not approved",
        body: rejectionNote
          ? `Your submission was not approved: ${rejectionNote}`
          : "Your submission was not approved. Please review your profile and try again.",
        nextStep: `Update your details, then submit again for review. ${APPROVAL_SLA}`,
      };
    case "draft":
      return {
        title: "Draft — not submitted",
        body: "Your profile isn't live yet. Complete your details and submit for review when you're ready.",
        nextStep: `After you submit, ${APPROVAL_SLA.toLowerCase()}`,
      };
  }
}
