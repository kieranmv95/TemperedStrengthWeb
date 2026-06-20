export interface HomeTestimonial {
  id: string;
  quote: string;
  detail: string;
  rating: number;
}

export const homeTestimonials: HomeTestimonial[] = [
  {
    id: "james",
    quote:
      "I've gone through PDF programmes for years and never finished a block. Tempered Strength is the first one I've stuck with. Swaps sorted it when our gym pulled the hack squat mid-cycle.",
    detail: "Powerlifter · Leeds",
    rating: 5,
  },
  {
    id: "sarah",
    quote:
      "The on-demand workouts are lovely for filler sessions between programme days. Recovery flows after Hyrox have helped a fair bit. I turn up to the next session in much better nick.",
    detail: "Hyrox athlete · Bristol",
    rating: 5,
  },
  {
    id: "marcus",
    quote:
      "Started on the free tier, didn't feel short-changed. Upgraded after six weeks for the full library. Swap cap was the only reason I needed Pro.",
    detail: "London",
    rating: 5,
  },
  {
    id: "emma",
    quote:
      "Finally an app that doesn't assume every gym has the same kit. Swaps are straightforward enough, and the in-session timer saves a wee faff between two apps mid-set.",
    detail: "Home gym · Edinburgh",
    rating: 5,
  },
  {
    id: "priya",
    quote:
      "Shuffling programme days when work overruns has kept me consistent. Structured but not stiff, which is sound when your week's all over the shop.",
    detail: "Manchester",
    rating: 5,
  },
];
