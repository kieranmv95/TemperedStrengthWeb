"use client";

import { useState, useTransition } from "react";
import {
  addEntityLink,
  removeEntityLink,
} from "@/app/portal/actions";
import type { PortalEntityKind, PortalLink } from "@/lib/portal/types";
import {
  MAX_ENTITY_LINKS,
  validateLink,
} from "@/lib/portal/validation";

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type EditProps = {
  mode: "edit";
  kind: PortalEntityKind;
  entityId: string;
  links: PortalLink[];
};

type CreateProps = {
  mode: "create";
  links?: PortalLink[];
};

type Props = EditProps | CreateProps;

function LinkListItem({
  link,
  onRemove,
  removing,
}: {
  link: PortalLink;
  onRemove?: () => void;
  removing?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{link.label}</p>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block break-all text-xs text-[#c9b072] hover:underline"
        >
          {link.url}
        </a>
      </div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="shrink-0 rounded-md border border-neutral-700 px-2 py-1 text-xs font-semibold text-neutral-400 hover:border-red-800/60 hover:text-red-300 disabled:opacity-50"
        >
          {removing ? "…" : "Remove"}
        </button>
      ) : null}
    </div>
  );
}

function AddLinkForm({
  onAdd,
  onCancel,
  pending,
  error,
  submitLabel,
}: {
  onAdd: (label: string, url: string) => void;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
  submitLabel: string;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(label, url);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-[#c9b072]/25 bg-[#c9b072]/5 p-3"
    >
      {error ? (
        <div className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-400">
          Label
        </span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Website, Instagram, Booking"
          className={inputClass}
          autoFocus
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-400">
          Web address
        </span>
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yoursite.com or https://…"
          className={inputClass}
        />
      </label>

      <p className="text-xs text-neutral-500">
        https:// is added automatically if you leave it off.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function LinksEditorEdit({ kind, entityId, links: initialLinks }: EditProps) {
  const [links, setLinks] = useState(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const atLimit = links.length >= MAX_ENTITY_LINKS;

  const handleAdd = (label: string, url: string) => {
    setFormError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await addEntityLink(kind, entityId, label, url);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setLinks(result.links);
      setShowForm(false);
      setSuccess("Link saved.");
    });
  };

  const handleRemove = (index: number) => {
    setFormError(null);
    setSuccess(null);
    setRemovingIndex(index);

    startTransition(async () => {
      const result = await removeEntityLink(kind, entityId, index);
      setRemovingIndex(null);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setLinks(result.links);
      setSuccess("Link removed.");
    });
  };

  return (
    <div className="space-y-3">
      {success ? (
        <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}

      {formError && !showForm ? (
        <div className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100">
          {formError}
        </div>
      ) : null}

      {links.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No links yet. Add your website, social profiles, or booking page.
        </p>
      ) : (
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={`${link.url}-${index}`}>
              <LinkListItem
                link={link}
                onRemove={() => handleRemove(index)}
                removing={removingIndex === index}
              />
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <AddLinkForm
          key={`add-${links.length}`}
          onAdd={handleAdd}
          onCancel={() => {
            setShowForm(false);
            setFormError(null);
          }}
          pending={isPending}
          error={formError}
          submitLabel="Save link"
        />
      ) : atLimit ? (
        <p className="text-xs text-neutral-500">
          Maximum of {MAX_ENTITY_LINKS} links reached.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setFormError(null);
            setSuccess(null);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2 text-sm font-semibold text-white hover:border-[#c9b072]/40 transition-colors"
        >
          Add link
        </button>
      )}
    </div>
  );
}

function LinksEditorCreate({ links: initialLinks = [] }: CreateProps) {
  const [links, setLinks] = useState<PortalLink[]>(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const atLimit = links.length >= MAX_ENTITY_LINKS;

  const handleAdd = (label: string, url: string) => {
    setFormError(null);

    try {
      const link = validateLink(label, url);
      if (links.length >= MAX_ENTITY_LINKS) {
        setFormError(`You can add up to ${MAX_ENTITY_LINKS} links.`);
        return;
      }
      setLinks((current) => [...current, link]);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid link.");
    }
  };

  const handleRemove = (index: number) => {
    setLinks((current) => current.filter((_, i) => i !== index));
    setFormError(null);
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={`${link.url}-${index}`}>
          <input type="hidden" name="link_label" value={link.label} />
          <input type="hidden" name="link_url" value={link.url} />
          <LinkListItem link={link} onRemove={() => handleRemove(index)} />
        </div>
      ))}

      {showForm ? (
        <AddLinkForm
          key={`add-${links.length}`}
          onAdd={handleAdd}
          onCancel={() => {
            setShowForm(false);
            setFormError(null);
          }}
          pending={false}
          error={formError}
          submitLabel="Add link"
        />
      ) : atLimit ? (
        <p className="text-xs text-neutral-500">
          Maximum of {MAX_ENTITY_LINKS} links reached.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setFormError(null);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2 text-sm font-semibold text-white hover:border-[#c9b072]/40 transition-colors"
        >
          Add link
        </button>
      )}

      {links.length === 0 ? (
        <p className="text-xs text-neutral-500">
          Optional — you can also add links after creating your profile.
        </p>
      ) : null}
    </div>
  );
}

export function LinksEditor(props: Props) {
  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-semibold text-white">Links</legend>
      <p className="text-sm text-neutral-500">
        Website, Instagram, booking page, or other useful links. Add one at a
        time and save each before adding another.
      </p>

      {props.mode === "edit" ? (
        <LinksEditorEdit {...props} />
      ) : (
        <LinksEditorCreate {...props} />
      )}
    </fieldset>
  );
}
