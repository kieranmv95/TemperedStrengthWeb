import type { LiveCompetitionOrderBy, LiveCompetitionTheme } from "./types";

export type AdminCompetition = {
  id: number;
  title: string;
  description: string;
  additionalInfo: string;
  linkText: string;
  orderBy: LiveCompetitionOrderBy;
  theme: LiveCompetitionTheme;
  activeInTest: boolean;
  activeInProduction: boolean;
};

export type AdminCompetitionEntry = {
  id: string;
  name: string;
  score: number;
  category: string;
};
