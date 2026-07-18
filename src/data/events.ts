export type Event = {
  title: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (same as startDate for single-day)
  allDay: boolean;
  url: string;
};

export const events: Event[] = [
  {
    title: "The RainHill Trials - Teams",
    location: "Bolton Arena",
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    allDay: true,
    url: "https://therainhilltrials.myshopify.com/",
  },
  {
    title: "The RainHill Trials - Masters",
    location: "Bolton Arena",
    startDate: "2026-07-26",
    endDate: "2026-07-26",
    allDay: true,
    url: "https://therainhilltrials.myshopify.com/",
  },
  {
    title: "Arena Games - Masters",
    location: "AO Arena",
    startDate: "2026-07-26",
    endDate: "2026-07-26",
    allDay: true,
    url: "https://www.thearenagames.co.uk/",
  },
];
