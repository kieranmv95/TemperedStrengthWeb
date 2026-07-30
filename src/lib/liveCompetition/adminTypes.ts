import type { LiveCompetitionMetricType, LiveCompetitionTheme } from "./types";

export type AdminCompetition = {
  id: number;
  title: string;
  description: string;
  additionalInfo: string;
  linkText: string;
  metricType: LiveCompetitionMetricType;
  theme: LiveCompetitionTheme;
  activeInTest: boolean;
  activeInProduction: boolean;
};

export type AdminCompetitionEntry = {
  id: string;
  name: string;
  score: number;
  category: string;
  contact: string | null;
};
