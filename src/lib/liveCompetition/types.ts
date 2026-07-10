export type CompetitionEnvironment = "test" | "production";

export type LiveCompetitionOrderBy = "weight" | "time";

export type LiveCompetitionTheme = {
  borderColor: string;
  bgColor: string;
  copyColor: string;
  linkColor: string;
  linkTextColor: string;
};

export type LiveCompetitionEntry = {
  name: string;
  score: number;
  category: string;
};

export type LiveCompetition = {
  title: string;
  description: string;
  additionalInfo: string;
  linkText: string;
  orderBy: LiveCompetitionOrderBy;
  theme: LiveCompetitionTheme;
  entries: LiveCompetitionEntry[];
};

type ActiveCompetitionRow = {
  title: string;
  description: string;
  additional_info: string;
  link_text: string;
  order_by: string;
  theme_border_color: string;
  theme_bg_color: string;
  theme_copy_color: string;
  theme_link_color: string;
  theme_link_text_color: string;
};

type CompetitionEntryRow = {
  name: string;
  score: number | string;
  category: string;
};

export function mapActiveCompetitionRow(
  row: ActiveCompetitionRow,
  entries: CompetitionEntryRow[]
): LiveCompetition {
  const orderBy = row.order_by;
  if (orderBy !== "weight" && orderBy !== "time") {
    throw new Error(`Invalid order_by value: ${orderBy}`);
  }

  return {
    title: row.title,
    description: row.description,
    additionalInfo: row.additional_info,
    linkText: row.link_text,
    orderBy,
    theme: {
      borderColor: row.theme_border_color,
      bgColor: row.theme_bg_color,
      copyColor: row.theme_copy_color,
      linkColor: row.theme_link_color,
      linkTextColor: row.theme_link_text_color,
    },
    entries: entries.map((entry) => {
      const score = Number(entry.score);
      if (!Number.isFinite(score)) {
        throw new Error(`Invalid score for entry: ${entry.name}`);
      }

      return {
        name: entry.name,
        score,
        category: entry.category,
      };
    }),
  };
}
