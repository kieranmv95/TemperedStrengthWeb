"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { deleteEntity } from "@/app/portal/actions";
import type { PortalEntityKind } from "@/lib/portal/types";

type Props = {
  kind: PortalEntityKind;
  id: string;
  name: string;
  entityLabel: string;
};

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-900/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 transition-colors disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete permanently"}
    </button>
  );
}

export function DeleteEntityButton({ kind, id, name, entityLabel }: Props) {
  const [open, setOpen] = useState(false);
  const deleteAction = deleteEntity.bind(null, kind, id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-red-900/50 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/40 transition-colors"
      >
        Delete
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-entity-title"
        >
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
            <h2
              id="delete-entity-title"
              className="text-lg font-semibold text-white"
            >
              Delete {entityLabel.toLowerCase()}?
            </h2>
            <p className="mt-3 text-sm text-neutral-300">
              <span className="font-medium text-white">{name}</span> will be
              permanently deleted. If this listing is approved, it will be
              removed from the app immediately.
            </p>
            <p className="mt-2 text-sm font-medium text-red-300">
              This cannot be undone.
            </p>

            <form action={deleteAction} className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <DeleteSubmitButton />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
