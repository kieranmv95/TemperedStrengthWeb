import type { SupabaseClient } from "@supabase/supabase-js";
import type { PortalEntityKind } from "./types";

export const PARTNER_IMAGE_BUCKET = "partner-images";

/** Max size of the original file the user selects. */
export const PARTNER_IMAGE_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Max size after client-side square crop and compression. */
export const PARTNER_IMAGE_MAX_PROCESSED_BYTES = 800 * 1024;

/** Output square image dimension in pixels. */
export const PARTNER_IMAGE_OUTPUT_SIZE = 1200;

export const PARTNER_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const PARTNER_IMAGE_MIME = "image/jpeg";

export function partnerImageStoragePath(
  kind: PortalEntityKind,
  entityId: string
): string {
  return `${kind}/${entityId}/cover.jpg`;
}

export function getPartnerImagePublicUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;

  return `${base}/storage/v1/object/public/${PARTNER_IMAGE_BUCKET}/${path}`;
}

export function parsePartnerImageFromForm(formData: FormData): {
  file: File | null;
  remove: boolean;
} {
  const remove = formData.get("remove_image") === "on";
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return { file: null, remove };
  }

  if (file.size > PARTNER_IMAGE_MAX_PROCESSED_BYTES) {
    throw new Error(
      `Processed image must be ${Math.round(PARTNER_IMAGE_MAX_PROCESSED_BYTES / 1024)}KB or smaller.`
    );
  }

  if (file.type !== PARTNER_IMAGE_MIME) {
    throw new Error("Invalid image format. Please upload a JPG, PNG, or WebP image.");
  }

  return { file, remove };
}

export async function uploadPartnerImage(
  supabase: SupabaseClient,
  kind: PortalEntityKind,
  entityId: string,
  file: File
): Promise<string> {
  const path = partnerImageStoragePath(kind, entityId);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(PARTNER_IMAGE_BUCKET).upload(path, buffer, {
    contentType: PARTNER_IMAGE_MIME,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function deletePartnerImage(
  supabase: SupabaseClient,
  path: string | null | undefined
): Promise<void> {
  if (!path?.trim()) return;

  const { error } = await supabase.storage.from(PARTNER_IMAGE_BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}

export async function applyPartnerImageFromForm(
  supabase: SupabaseClient,
  kind: PortalEntityKind,
  entityId: string,
  formData: FormData,
  existingPath: string | null
): Promise<string | null> {
  const { file, remove } = parsePartnerImageFromForm(formData);

  if (remove) {
    if (existingPath) {
      await deletePartnerImage(supabase, existingPath);
    }
    return null;
  }

  if (file) {
    if (existingPath) {
      await deletePartnerImage(supabase, existingPath);
    }
    return uploadPartnerImage(supabase, kind, entityId, file);
  }

  return existingPath;
}
