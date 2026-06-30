"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITY_CONFIGS, isPortalEntityKind } from "@/lib/portal/constants";
import type { PortalEntityKind } from "@/lib/portal/types";
import {
  enrichVenueAddress,
  lookupPostcodeDetails,
  PostcodeNotFoundError,
  type PostcodeLookupDetails,
} from "@/lib/portal/geocode";
import {
  parseAddressFromForm,
  parseLinks,
  parseOpeningHours,
  parseRadiusServedKm,
  parseSpecialtiesFromForm,
  parseContactFromForm,
  parseFocusAreasFromForm,
  parseMapMarkerFromForm,
  parseHideLocation,
  parseHasOpeningHours,
  validateDescription,
  validateEntityName,
  validateLink,
  isAddressComplete,
  MAX_ENTITY_LINKS,
} from "@/lib/portal/validation";
import type { PortalLink, VenueAddress } from "@/lib/portal/types";
import { mapEntity } from "@/lib/portal/db";
import {
  ensurePortalProfile,
  validateDisplayName,
} from "@/lib/portal/profile";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/portal/login");
  }

  return { supabase, user };
}

function entityPath(kind: PortalEntityKind, id?: string) {
  return id ? `/portal/${kind}/${id}` : `/portal/${kind}`;
}

export type EntitySaveResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

/** Result shape for portal forms — errors stay on the page, no redirect. */
export type PortalFormResult = EntitySaveResult;

async function parseAndEnrichAddress(formData: FormData): Promise<VenueAddress> {
  const address = parseAddressFromForm(formData);
  return enrichVenueAddress(address);
}

function applyOpeningHoursToPayload(
  kind: PortalEntityKind,
  formData: FormData,
  payload: Record<string, unknown>
) {
  if (kind === "clubs") {
    const hasOpeningHours = parseHasOpeningHours(formData);
    payload.has_opening_hours = hasOpeningHours;
    payload.opening_hours = hasOpeningHours ? parseOpeningHours(formData) : {};
    return;
  }

  if (kind === "gyms") {
    payload.opening_hours = parseOpeningHours(formData);
  }
}

export type PostcodeLookupResponse =
  | { ok: true; details: PostcodeLookupDetails }
  | { ok: false; error: string };

export async function lookupPostcode(
  postcode: string,
  country: string
): Promise<PostcodeLookupResponse> {
  try {
    const details = await lookupPostcodeDetails(postcode, country);
    return { ok: true, details };
  } catch (err) {
    if (err instanceof PostcodeNotFoundError) {
      return {
        ok: false,
        error: "We couldn't find that postcode. Please check it and try again.",
      };
    }
    const message =
      err instanceof Error ? err.message : "Postcode lookup failed.";
    return { ok: false, error: message };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function savePortalDisplayName(
  formData: FormData
): Promise<PortalFormResult> {
  const { supabase, user } = await requireUser();

  try {
    const display_name = validateDisplayName(
      String(formData.get("display_name") ?? "")
    );

    await ensurePortalProfile(user.id);

    const { error } = await supabase
      .from("portal_profiles")
      .update({ display_name })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save your name.",
    };
  }

  revalidatePath("/portal");
  return { ok: true, redirectTo: "/portal" };
}

export async function createEntity(
  kind: PortalEntityKind,
  formData: FormData
): Promise<EntitySaveResult> {
  if (!isPortalEntityKind(kind)) {
    return { ok: false, error: "Invalid entity type." };
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  let newId: string | undefined;
  let errorMessage: string | undefined;

  try {
    const name = validateEntityName(String(formData.get("name") ?? ""));
    const description = validateDescription(String(formData.get("description") ?? ""));
    const links = parseLinks(formData);
    const contact = parseContactFromForm(formData);

    const payload: Record<string, unknown> = {
      owner_id: user.id,
      name,
      description,
      email: contact.email,
      phone: contact.phone,
      links,
      status: "draft",
    };

    if (config.hasOpeningHours) {
      applyOpeningHoursToPayload(kind, formData, payload);
    }

    if (config.hasAddress) {
      payload.address = await parseAndEnrichAddress(formData);
      payload.map_marker = parseMapMarkerFromForm(formData);
    }

    if (kind === "coaches") {
      payload.specialties = parseSpecialtiesFromForm(formData);
      payload.radius_served_km = parseRadiusServedKm(formData);
    }

    if (kind === "gyms") {
      payload.focus_areas = parseFocusAreasFromForm(formData);
    }

    if (config.canHideLocation) {
      payload.hide_location = parseHideLocation(formData);
    }

    const { data, error } = await supabase
      .from(config.table)
      .insert(payload)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    newId = data.id;
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Could not create entity.";
  }

  if (errorMessage) {
    return { ok: false, error: errorMessage };
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  return { ok: true, redirectTo: entityPath(kind, newId) };
}

export async function updateEntity(
  kind: PortalEntityKind,
  id: string,
  formData: FormData
): Promise<EntitySaveResult> {
  if (!isPortalEntityKind(kind)) {
    return { ok: false, error: "Invalid entity type." };
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  let errorMessage: string | undefined;

  try {
    const name = validateEntityName(String(formData.get("name") ?? ""));
    const description = validateDescription(String(formData.get("description") ?? ""));
    const contact = parseContactFromForm(formData);

    const payload: Record<string, unknown> = {
      name,
      description,
      email: contact.email,
      phone: contact.phone,
    };

    if (config.hasOpeningHours) {
      applyOpeningHoursToPayload(kind, formData, payload);
    }

    if (config.hasAddress) {
      payload.address = await parseAndEnrichAddress(formData);
      payload.map_marker = parseMapMarkerFromForm(formData);
    }

    if (kind === "coaches") {
      payload.specialties = parseSpecialtiesFromForm(formData);
      payload.radius_served_km = parseRadiusServedKm(formData);
    }

    if (kind === "gyms") {
      payload.focus_areas = parseFocusAreasFromForm(formData);
    }

    if (config.canHideLocation) {
      payload.hide_location = parseHideLocation(formData);
    }

    const { error } = await supabase
      .from(config.table)
      .update(payload)
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) throw new Error(error.message);
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Could not save changes.";
  }

  if (errorMessage) {
    return { ok: false, error: errorMessage };
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  revalidatePath(entityPath(kind, id));
  return { ok: true, redirectTo: `${entityPath(kind, id)}?saved=1` };
}

export type LinkActionResult =
  | { ok: true; links: PortalLink[] }
  | { ok: false; error: string };

async function fetchOwnedEntityLinks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kind: PortalEntityKind,
  id: string,
  ownerId: string
): Promise<PortalLink[] | null> {
  const config = ENTITY_CONFIGS[kind];
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error || !data) return null;

  const entity = mapEntity(kind, data as Record<string, unknown>);
  return entity.links;
}

export async function addEntityLink(
  kind: PortalEntityKind,
  id: string,
  label: string,
  url: string
): Promise<LinkActionResult> {
  if (!isPortalEntityKind(kind)) {
    return { ok: false, error: "Invalid listing type." };
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  let link: PortalLink;
  try {
    link = validateLink(label, url);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invalid link.",
    };
  }

  const currentLinks = await fetchOwnedEntityLinks(supabase, kind, id, user.id);
  if (!currentLinks) {
    return { ok: false, error: "Listing not found." };
  }

  if (currentLinks.length >= MAX_ENTITY_LINKS) {
    return {
      ok: false,
      error: `You can add up to ${MAX_ENTITY_LINKS} links.`,
    };
  }

  const links = [...currentLinks, link];

  const { error } = await supabase
    .from(config.table)
    .update({ links })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));

  return { ok: true, links };
}

export async function removeEntityLink(
  kind: PortalEntityKind,
  id: string,
  index: number
): Promise<LinkActionResult> {
  if (!isPortalEntityKind(kind)) {
    return { ok: false, error: "Invalid listing type." };
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  const currentLinks = await fetchOwnedEntityLinks(supabase, kind, id, user.id);
  if (!currentLinks) {
    return { ok: false, error: "Listing not found." };
  }

  if (index < 0 || index >= currentLinks.length) {
    return { ok: false, error: "That link no longer exists. Refresh and try again." };
  }

  const links = currentLinks.filter((_, i) => i !== index);

  const { error } = await supabase
    .from(config.table)
    .update({ links })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));

  return { ok: true, links };
}

export async function submitEntityForReview(
  kind: PortalEntityKind,
  id: string
): Promise<PortalFormResult> {
  if (!isPortalEntityKind(kind)) {
    return { ok: false, error: "Invalid entity type." };
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  const { data: existing, error: fetchError } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return { ok: false, error: "Entity not found." };
  }

  const entity = mapEntity(kind, existing);

  if (config.hasAddress && "address" in entity && !isAddressComplete(entity.address)) {
    return {
      ok: false,
      error: "Please complete the venue address before submitting for review.",
    };
  }

  const { error } = await supabase
    .from(config.table)
    .update({
      status: "pending",
      submitted_at: new Date().toISOString(),
      rejection_note: null,
    })
    .eq("id", id)
    .eq("owner_id", user.id)
    .in("status", ["draft", "rejected"]);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  revalidatePath(entityPath(kind, id));
  return { ok: true, redirectTo: `${entityPath(kind, id)}?submitted=1` };
}

export async function deleteEntity(kind: PortalEntityKind, id: string) {
  if (!isPortalEntityKind(kind)) {
    throw new Error("Invalid entity type.");
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  const { data, error } = await supabase
    .from(config.table)
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id");

  if (error) {
    redirect(`${entityPath(kind, id)}?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.length) {
    redirect(
      `${entityPath(kind, id)}?error=${encodeURIComponent("Could not delete this listing. Please try again.")}`
    );
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  redirect(entityPath(kind));
}
