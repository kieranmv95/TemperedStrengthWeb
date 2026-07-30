import type { LiveCompetitionMetricType } from "./metrics";
import {
  COMPETITION_METRIC_TYPES,
  isLiveCompetitionMetricType,
} from "./metrics";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function requireText(value: FormDataEntryValue | null, label: string, max: number): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }
  if (trimmed.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }
  return trimmed;
}

function optionalText(value: FormDataEntryValue | null, max: number): string {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length > max) {
    throw new Error(`Text must be ${max} characters or fewer.`);
  }
  return trimmed;
}

function requireHexColor(value: FormDataEntryValue | null, label: string): string {
  const trimmed = String(value ?? "").trim();
  if (!HEX_COLOR.test(trimmed)) {
    throw new Error(`${label} must be a hex colour, e.g. #FF3801.`);
  }
  return trimmed.toUpperCase();
}

function parseMetricType(value: FormDataEntryValue | null): LiveCompetitionMetricType {
  const metricType = String(value ?? "").trim();
  if (!isLiveCompetitionMetricType(metricType)) {
    throw new Error(
      `Metric type must be one of: ${COMPETITION_METRIC_TYPES.join(", ")}.`
    );
  }
  return metricType;
}

function parseScore(value: FormDataEntryValue | null): number {
  const raw = String(value ?? "").trim();
  if (!raw) {
    throw new Error("Score is required.");
  }
  const score = Number(raw);
  if (!Number.isFinite(score) || score < 0) {
    throw new Error("Score must be a zero or positive number.");
  }
  return score;
}

export function parseCompetitionDetailsFromForm(formData: FormData) {
  return {
    title: requireText(formData.get("title"), "Title", 200),
    description: optionalText(formData.get("description"), 5000),
    additional_info: optionalText(formData.get("additional_info"), 5000),
    link_text: requireText(formData.get("link_text"), "Link text", 100),
    metric_type: parseMetricType(formData.get("metric_type")),
    theme_border_color: requireHexColor(
      formData.get("theme_border_color"),
      "Border colour"
    ),
    theme_bg_color: requireHexColor(formData.get("theme_bg_color"), "Background colour"),
    theme_copy_color: requireHexColor(formData.get("theme_copy_color"), "Text colour"),
    theme_link_color: requireHexColor(formData.get("theme_link_color"), "Link colour"),
    theme_link_text_color: requireHexColor(
      formData.get("theme_link_text_color"),
      "Link text colour"
    ),
    active_in_test: formData.get("active_in_test") === "on",
    active_in_production: formData.get("active_in_production") === "on",
    updated_at: new Date().toISOString(),
  };
}

export function parseCompetitionEntryFromForm(formData: FormData) {
  const contact = optionalText(formData.get("contact"), 200);

  return {
    name: requireText(formData.get("name"), "Name", 200),
    category: requireText(formData.get("category"), "Category", 50),
    score: parseScore(formData.get("score")),
    contact: contact || null,
  };
}
