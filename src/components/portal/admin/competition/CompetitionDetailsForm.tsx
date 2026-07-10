"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateCompetitionDetails } from "@/app/portal/(authenticated)/admin/competition/actions";
import { useScrollOnError } from "@/components/portal/useScrollOnError";
import type { AdminCompetition } from "@/lib/liveCompetition/adminTypes";

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type FormState = {
  error: string | null;
  saved: boolean;
};

type Props = {
  competition: AdminCompetition;
};

function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-neutral-400">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          defaultValue={defaultValue}
          onChange={(e) => {
            const text = document.getElementById(name) as HTMLInputElement | null;
            if (text) text.value = e.target.value.toUpperCase();
          }}
          className="h-10 w-10 shrink-0 cursor-pointer rounded border border-neutral-800 bg-neutral-950"
          aria-label={`${label} picker`}
        />
        <input
          id={name}
          type="text"
          name={name}
          defaultValue={defaultValue}
          pattern="^#[0-9A-Fa-f]{6}$"
          className={inputClass}
          spellCheck={false}
        />
      </div>
    </label>
  );
}

export function CompetitionDetailsForm({ competition }: Props) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await updateCompetitionDetails(formData);

      if (result.ok) {
        router.refresh();
        return { error: null, saved: true };
      }

      return { error: result.error, saved: false };
    },
    { error: null, saved: false }
  );

  useScrollOnError(state.error);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div
          className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      {state.saved ? (
        <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100">
          Competition details saved.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-white">Title</span>
          <input
            type="text"
            name="title"
            required
            defaultValue={competition.title}
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-white">Description</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={competition.description}
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-white">
            Additional info
          </span>
          <textarea
            name="additional_info"
            rows={4}
            defaultValue={competition.additionalInfo}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Link text</span>
          <input
            type="text"
            name="link_text"
            required
            defaultValue={competition.linkText}
            placeholder="View The Leaderboard"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Order by</span>
          <select
            name="order_by"
            defaultValue={competition.orderBy}
            className={inputClass}
          >
            <option value="weight">Weight (highest first)</option>
            <option value="time">Time (lowest first)</option>
          </select>
        </label>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-white">Theme colours</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ColorField
            label="Border"
            name="theme_border_color"
            defaultValue={competition.theme.borderColor}
          />
          <ColorField
            label="Background"
            name="theme_bg_color"
            defaultValue={competition.theme.bgColor}
          />
          <ColorField
            label="Text"
            name="theme_copy_color"
            defaultValue={competition.theme.copyColor}
          />
          <ColorField
            label="Link"
            name="theme_link_color"
            defaultValue={competition.theme.linkColor}
          />
          <ColorField
            label="Link text"
            name="theme_link_text_color"
            defaultValue={competition.theme.linkTextColor}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
        <p className="text-sm font-semibold text-white">Visibility</p>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="active_in_test"
            defaultChecked={competition.activeInTest}
            className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/50"
          />
          <span className="text-sm text-neutral-300">
            Live in <span className="font-semibold text-white">test</span> app builds
            (<code className="text-xs text-neutral-500">?environment=test</code>)
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="active_in_production"
            defaultChecked={competition.activeInProduction}
            className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/50"
          />
          <span className="text-sm text-neutral-300">
            Live in <span className="font-semibold text-white">production</span> app
            (<code className="text-xs text-neutral-500">?environment=production</code>)
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
      >
        {isPending ? "Saving…" : "Save competition details"}
      </button>
    </form>
  );
}
