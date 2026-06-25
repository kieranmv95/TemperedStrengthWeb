"use client";

import { useState } from "react";
import {
  MAX_TAG_LENGTH,
  MAX_TAG_LIST_ITEMS,
  normalizeTagList,
} from "@/lib/portal/validation";

type Props = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  initialTags?: string[];
  itemLabel?: string;
  itemLabelPlural?: string;
  exampleTags?: string[];
};

export function TagListInput({
  name,
  label,
  description,
  placeholder = "Type and press Enter",
  initialTags = [],
  itemLabel = "item",
  itemLabelPlural,
  exampleTags,
}: Props) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const tryAdd = (raw: string) => {
    setError(null);
    const trimmed = raw.trim();
    if (!trimmed) return;

    try {
      const next = normalizeTagList([...tags, trimmed], {
        maxItems: MAX_TAG_LIST_ITEMS,
        maxLength: MAX_TAG_LENGTH,
        itemLabel,
        itemLabelPlural,
      });
      setTags(next);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add item.");
    }
  };

  const removeTag = (index: number) => {
    setTags((current) => current.filter((_, i) => i !== index));
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      tryAdd(input);
      return;
    }

    if (e.key === "Backspace" && !input && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
      setError(null);
    }
  };

  const atLimit = tags.length >= MAX_TAG_LIST_ITEMS;

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-white">{label}</span>
      {description ? (
        <p className="text-xs text-neutral-500">{description}</p>
      ) : null}

      {exampleTags && exampleTags.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs text-neutral-500">Example:</p>
          <ul className="flex flex-wrap gap-1.5" aria-hidden>
            {exampleTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-dashed border-neutral-700 bg-neutral-900/40 px-2.5 py-1 text-xs text-neutral-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 focus-within:border-[#c9b072]/50">
        {tags.length > 0 ? (
          <ul className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <li key={`${tag}-${index}`}>
                <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-sm text-white">
                  <span className="truncate">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="shrink-0 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    aria-label={`Remove ${tag}`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
                <input type="hidden" name={name} value={tag} />
              </li>
            ))}
          </ul>
        ) : null}

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (input.trim()) tryAdd(input);
          }}
          disabled={atLimit}
          placeholder={atLimit ? `Maximum of ${MAX_TAG_LIST_ITEMS} reached` : placeholder}
          className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {error ? <p className="text-xs text-red-300">{error}</p> : null}

      <p className="text-xs text-neutral-600">
        Press Enter to add each {itemLabel}. Up to {MAX_TAG_LIST_ITEMS},{" "}
        {MAX_TAG_LENGTH} characters each.
      </p>
    </div>
  );
}
