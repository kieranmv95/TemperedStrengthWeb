"use client";

import { useRef, useState } from "react";
import {
  PARTNER_IMAGE_ACCEPT,
  PARTNER_IMAGE_MAX_PROCESSED_BYTES,
  PARTNER_IMAGE_MAX_UPLOAD_BYTES,
  getPartnerImagePublicUrl,
} from "@/lib/portal/partnerImages";
import { processPartnerImage } from "@/lib/portal/processPartnerImage";

type Props = {
  imagePath?: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveChange: (remove: boolean) => void;
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
  return `${Math.round(bytes / 1024)}KB`;
}

export function ListingImageEditor({
  imagePath,
  onImageChange,
  onRemoveChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const existingUrl = getPartnerImagePublicUrl(imagePath);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSize, setProcessedSize] = useState<number | null>(null);

  const displayUrl = !removed ? previewUrl ?? existingUrl : previewUrl;

  const handlePick = async (file: File | null) => {
    setError(null);
    setProcessedSize(null);
    onRemoveChange(false);
    setRemoved(false);

    if (!file) {
      onImageChange(null);
      setPreviewUrl(null);
      return;
    }

    setIsProcessing(true);
    try {
      const processed = await processPartnerImage(file);
      onImageChange(processed);
      setProcessedSize(processed.size);
      setPreviewUrl((current) => {
        if (current?.startsWith("blob:")) {
          URL.revokeObjectURL(current);
        }
        return URL.createObjectURL(processed);
      });
    } catch (err) {
      onImageChange(null);
      setPreviewUrl(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setError(err instanceof Error ? err.message : "Could not process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setError(null);
    setRemoved(true);
    setProcessedSize(null);
    onImageChange(null);
    onRemoveChange(true);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <fieldset className="min-w-0 space-y-3 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
      <legend className="px-1 text-sm font-semibold text-white">Cover image</legend>
      <p className="text-xs text-neutral-500">
        Optional. Shown on your listing in the app. Images are cropped to a square
        (1:1). Max upload {formatSize(PARTNER_IMAGE_MAX_UPLOAD_BYTES)} — we compress
        to about {formatSize(PARTNER_IMAGE_MAX_PROCESSED_BYTES)} or less.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative mx-auto aspect-square w-full max-w-[10rem] shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 sm:mx-0">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt="Listing cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-neutral-600">
              No image
            </div>
          )}
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
              Processing…
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={PARTNER_IMAGE_ACCEPT}
            disabled={isProcessing}
            onChange={(e) => void handlePick(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-neutral-400 file:mr-3 file:rounded-md file:border-0 file:bg-[#c9b072] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-[#d4c08a] disabled:opacity-50"
          />
          {processedSize != null ? (
            <p className="text-xs text-emerald-300/90">
              Ready to upload ({formatSize(processedSize)}, square 1:1).
            </p>
          ) : null}
          {(existingUrl && !removed) || previewUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isProcessing}
              className="text-xs font-medium text-red-300 hover:underline disabled:opacity-50"
            >
              Remove image
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
