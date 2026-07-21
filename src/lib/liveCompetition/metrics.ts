export const COMPETITION_METRIC_TYPES = [
  "max_weight",
  "max_reps",
  "max_time",
  "max_calories",
  "max_distance",
] as const;

export type LiveCompetitionMetricType = (typeof COMPETITION_METRIC_TYPES)[number];

export type MetricConfig = {
  value: LiveCompetitionMetricType;
  label: string;
  description: string;
  scoreHint: string;
  scorePlaceholder: string;
  unit: string;
  sortDirection: "asc" | "desc";
};

export const METRIC_TYPE_OPTIONS: MetricConfig[] = [
  {
    value: "max_weight",
    label: "Max weight",
    description: "Highest weight wins (kg)",
    scoreHint: "Weight in kg (e.g. 142)",
    scorePlaceholder: "142",
    unit: "kg",
    sortDirection: "desc",
  },
  {
    value: "max_reps",
    label: "Max reps",
    description: "Most reps wins",
    scoreHint: "Rep count (e.g. 25)",
    scorePlaceholder: "25",
    unit: "reps",
    sortDirection: "desc",
  },
  {
    value: "max_time",
    label: "Max time",
    description: "Fastest time wins (seconds)",
    scoreHint: "Time in seconds (e.g. 95 for 1:35)",
    scorePlaceholder: "95",
    unit: "s",
    sortDirection: "asc",
  },
  {
    value: "max_calories",
    label: "Max calories",
    description: "Most calories wins",
    scoreHint: "Calories burned (e.g. 450)",
    scorePlaceholder: "450",
    unit: "kcal",
    sortDirection: "desc",
  },
  {
    value: "max_distance",
    label: "Max distance",
    description: "Longest distance wins (metres)",
    scoreHint: "Distance in metres (e.g. 5000)",
    scorePlaceholder: "5000",
    unit: "m",
    sortDirection: "desc",
  },
];

const METRIC_CONFIG_BY_VALUE = Object.fromEntries(
  METRIC_TYPE_OPTIONS.map((option) => [option.value, option])
) as Record<LiveCompetitionMetricType, MetricConfig>;

export function isLiveCompetitionMetricType(
  value: string
): value is LiveCompetitionMetricType {
  return COMPETITION_METRIC_TYPES.includes(value as LiveCompetitionMetricType);
}

export function getMetricConfig(metricType: LiveCompetitionMetricType): MetricConfig {
  return METRIC_CONFIG_BY_VALUE[metricType];
}

export function compareScores(
  a: number,
  b: number,
  metricType: LiveCompetitionMetricType
): number {
  const { sortDirection } = getMetricConfig(metricType);
  return sortDirection === "desc" ? b - a : a - b;
}

export function formatScoreForDisplay(
  score: number,
  metricType: LiveCompetitionMetricType
): string {
  switch (metricType) {
    case "max_weight":
      return `${score} kg`;
    case "max_reps":
      return `${score} reps`;
    case "max_time": {
      const minutes = Math.floor(score / 60);
      const seconds = Math.round(score % 60);
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
    case "max_calories":
      return `${score} kcal`;
    case "max_distance":
      return `${score} m`;
  }
}

export function getSortDescription(metricType: LiveCompetitionMetricType): string {
  const { sortDirection, label } = getMetricConfig(metricType);
  return sortDirection === "desc"
    ? `highest ${label.toLowerCase()} first`
    : `fastest ${label.toLowerCase()} first`;
}
