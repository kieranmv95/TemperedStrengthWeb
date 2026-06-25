"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITY_CONFIGS, isPortalEntityKind } from "@/lib/portal/constants";
import type { PortalEntityKind } from "@/lib/portal/types";
import {
  parseAddressFromForm,
  parseLinks,
  parseOpeningHours,
  parseRadiusServedKm,
  parseSpecialtiesFromForm,
  validateDescription,
  validateEntityName,
  isAddressComplete,
} from "@/lib/portal/validation";
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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function savePortalDisplayName(formData: FormData) {
  const { supabase, user } = await requireUser();

  let errorMessage: string | undefined;

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
    errorMessage =
      err instanceof Error ? err.message : "Could not save your name.";
  }

  if (errorMessage) {
    redirect(`/portal/setup?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/portal");
  redirect("/portal");
}

export async function createEntity(kind: PortalEntityKind, formData: FormData) {
  if (!isPortalEntityKind(kind)) {
    throw new Error("Invalid entity type.");
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  let newId: string | undefined;
  let errorMessage: string | undefined;

  try {
    const name = validateEntityName(String(formData.get("name") ?? ""));
    const description = validateDescription(String(formData.get("description") ?? ""));
    const links = parseLinks(formData);

    const payload: Record<string, unknown> = {
      owner_id: user.id,
      name,
      description,
      links,
      status: "draft",
    };

    if (config.hasOpeningHours) {
      payload.opening_hours = parseOpeningHours(formData);
    }

    if (config.hasAddress) {
      payload.address = parseAddressFromForm(formData);
    }

    if (kind === "coaches") {
      payload.specialties = parseSpecialtiesFromForm(formData);
      payload.radius_served_km = parseRadiusServedKm(formData);
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
    redirect(`${entityPath(kind)}/new?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  redirect(entityPath(kind, newId));
}

export async function updateEntity(
  kind: PortalEntityKind,
  id: string,
  formData: FormData
) {
  if (!isPortalEntityKind(kind)) {
    throw new Error("Invalid entity type.");
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  let errorMessage: string | undefined;

  try {
    const name = validateEntityName(String(formData.get("name") ?? ""));
    const description = validateDescription(String(formData.get("description") ?? ""));
    const links = parseLinks(formData);

    const payload: Record<string, unknown> = {
      name,
      description,
      links,
    };

    if (config.hasOpeningHours) {
      payload.opening_hours = parseOpeningHours(formData);
    }

    if (config.hasAddress) {
      payload.address = parseAddressFromForm(formData);
    }

    if (kind === "coaches") {
      payload.specialties = parseSpecialtiesFromForm(formData);
      payload.radius_served_km = parseRadiusServedKm(formData);
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
    redirect(`${entityPath(kind, id)}?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  revalidatePath(entityPath(kind, id));
  redirect(`${entityPath(kind, id)}?saved=1`);
}

export async function submitEntityForReview(kind: PortalEntityKind, id: string) {
  if (!isPortalEntityKind(kind)) {
    throw new Error("Invalid entity type.");
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
    redirect(`${entityPath(kind, id)}?error=${encodeURIComponent("Entity not found.")}`);
  }

  const entity = mapEntity(kind, existing);

  if (config.hasAddress && "address" in entity && !isAddressComplete(entity.address)) {
    redirect(
      `${entityPath(kind, id)}?error=${encodeURIComponent("Please complete the venue address before submitting for review.")}`
    );
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
    redirect(`${entityPath(kind, id)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  revalidatePath(entityPath(kind, id));
  redirect(`${entityPath(kind, id)}?submitted=1`);
}

export async function deleteEntity(kind: PortalEntityKind, id: string) {
  if (!isPortalEntityKind(kind)) {
    throw new Error("Invalid entity type.");
  }

  const { supabase, user } = await requireUser();
  const config = ENTITY_CONFIGS[kind];

  const { error } = await supabase
    .from(config.table)
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("status", "draft");

  if (error) {
    redirect(`${entityPath(kind, id)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/portal");
  revalidatePath(entityPath(kind));
  redirect(entityPath(kind));
}
