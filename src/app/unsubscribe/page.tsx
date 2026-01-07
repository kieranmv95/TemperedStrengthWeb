"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeAction } from "./actions";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [state, formAction, isPending] = useActionState(
    unsubscribeAction,
    null
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold">Unsubscribe</h1>
      <p className="mb-4 text-gray-600">
        Are you sure you want to stop receiving updates for {email}?
      </p>

      <form action={formAction}>
        <input type="hidden" name="email" value={email || ""} />
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          {isPending ? "Unsubscribing..." : "Confirm Unsubscribe"}
        </button>

        {state?.message && (
          <p className={state.success ? "text-green-600" : "text-red-600"}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          Loading...
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}
