import { Suspense } from "react";
import PortalLoginForm from "./PortalLoginForm";

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="text-neutral-400">Loading…</div>}>
      <PortalLoginForm />
    </Suspense>
  );
}
