"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const PARAGRAPHS = [
  "By providing your details and taking part in this challenge, you confirm that you have read, understood, and accept the following:",
  "Maximal-effort rowing is a strenuous physical activity carrying inherent risks, including but not limited to muscle strain, back injury, dizziness, fainting, cardiovascular events, and aggravation of existing injuries or medical conditions.",
  "You confirm that you are in good physical health and have no medical condition or injury that would make participation unsafe. If in any doubt, you should not take part. It is your responsibility to warm up appropriately, use correct technique, and stop immediately if you feel pain, dizziness, or discomfort.",
  'You take part entirely at your own risk. To the fullest extent permitted by law, Tempered Strength and Northern Gym Equipment ("the Organisers"), their staff and volunteers, accept no liability for any injury, loss, or damage arising from your participation, except where caused by their negligence.',
  "Participants must be aged 18 or over, or accompanied by a parent/guardian who consents on their behalf.",
  "Your name, email address, and score will be recorded solely for the purposes of running the competition and contacting prize winners. You will only be contacted if you win. All personal details will be deleted the day after the competition closes, and will not be shared with anyone else or used for marketing.",
  "Photographs and video may be taken at the stand and may be used by the Organisers during and after the event for promotional purposes, including on websites and social media. If you'd prefer not to appear, let a member of staff know before taking part.",
] as const;

export function CompetitionConditionsOfEntryLink() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const overlay =
    open ? (
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-white text-black"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex shrink-0 items-center justify-end border-b border-neutral-200 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2
              id={titleId}
              className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              30-Second Row Challenge — Conditions of Entry
            </h2>

            {PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph}
                className="text-xl leading-relaxed text-neutral-800 sm:text-2xl sm:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-[#c9b072] underline-offset-2 hover:underline"
      >
        Conditions of entry
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
