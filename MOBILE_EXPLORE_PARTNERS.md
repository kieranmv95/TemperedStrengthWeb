# Mobile app prompt: Explore page — Gyms, Clubs & Coaches

Use this document to implement partner listings on the **Explore** screen in the Tempered Strength mobile app. Data is served from the website API (partner portal on [temperedstrength.com](https://temperedstrength.com)); only **admin-approved** listings are returned.

---

## Goal

Add **three optional blocks** to the existing Explore page:

1. **Gyms**
2. **Clubs**
3. **Coaches / PTs**

Each block surfaces listings from the API below. **Hide a block entirely when its API returns an empty array** — on launch there will likely be no (or few) approved entries, so the Explore page should look unchanged until data exists.

Within each visible block, reuse the **existing Favourites UI patterns** (card layout, heart/save control, list → detail navigation) so partner entries feel native to Explore — not a bolted-on section.

---

## API base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://temperedstrength.com` |
| Local dev (website) | `http://localhost:3000` |

All routes are **unauthenticated** `GET` requests. No API keys required from the app.

---

## API routes

| Resource | Method | Path | Response |
|----------|--------|------|----------|
| Gyms | `GET` | `/api/gyms` | `PublicGymListing[]` |
| Clubs | `GET` | `/api/clubs` | `PublicClubListing[]` |
| Coaches | `GET` | `/api/coaches` | `PublicCoachListing[]` |

### Examples

```
GET https://temperedstrength.com/api/gyms
GET https://temperedstrength.com/api/clubs
GET https://temperedstrength.com/api/coaches
```

### Success response

- **Status:** `200`
- **Body:** JSON array (may be empty `[]`)
- **Cache:** `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600` — safe to cache ~5 minutes client-side

### Error responses

| Status | Body | Meaning |
|--------|------|---------|
| `503` | `{ "error": "Partner listings are not configured." }` | Website missing Supabase config — treat as empty list or show nothing |
| `500` | `{ "error": "<message>" }` | Server error — fail silently on Explore (hide block), log for debugging |

### Fetch behaviour on Explore

1. On Explore mount (or app foreground), fetch all three endpoints **in parallel**.
2. If a request fails or returns non-200, treat that category as **empty** (do not show the block).
3. If `array.length === 0`, **do not render** that block.
4. Order of visible blocks on Explore (top → bottom): **Gyms → Clubs → Coaches** (adjust only if Explore already has a fixed section order — insert these naturally among existing blocks).

---

## TypeScript types (copy into mobile app)

```typescript
/** Days used in openingHours (gyms & clubs only). */
export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayHours =
  | { open: string; close: string } // "HH:mm" 24h, e.g. "06:00", "22:00"
  | { closed: true };

export type OpeningHours = Record<DayKey, DayHours>;

export type PublicLink = {
  label: string;
  url: string;
};

export type PublicVenueAddress = {
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  country: string; // ISO-style, e.g. "GB"
  latitude: number | null; // reserved for future map pin
  longitude: number | null;
};

/** Shared fields for all partner listing types. */
export type PublicListingBase = {
  id: string; // UUID — stable favourite key
  name: string;
  description: string | null;
  address: PublicVenueAddress;
  links: PublicLink[];
  approvedAt: string | null; // ISO 8601
  updatedAt: string; // ISO 8601
};

export type PublicGymListing = PublicListingBase & {
  openingHours: OpeningHours;
};

export type PublicClubListing = PublicListingBase & {
  openingHours: OpeningHours;
};

export type PublicCoachListing = PublicListingBase & {
  specialties: string[]; // e.g. ["Powerlifting", "Nutrition"]
  radiusServedKm: number | null; // approximate service radius in km; null if not set
};
// Coaches have no openingHours field.

export type PartnerKind = "gym" | "club" | "coach";

/** Discriminated union for favourites / navigation. */
export type PartnerListing =
  | (PublicGymListing & { kind: "gym" })
  | (PublicClubListing & { kind: "club" })
  | (PublicCoachListing & { kind: "coach" });
```

---

## Example JSON (`GET /api/gyms`)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Tempered Strength Test Gym",
    "description": "Independent strength gym with platforms and racks.",
    "address": {
      "line1": "123 High Street",
      "line2": null,
      "city": "Manchester",
      "county": "Greater Manchester",
      "postcode": "M1 1AA",
      "country": "GB",
      "latitude": null,
      "longitude": null
    },
    "links": [
      { "label": "Website", "url": "https://example.com" },
      { "label": "Instagram", "url": "https://instagram.com/example" }
    ],
    "openingHours": {
      "monday": { "open": "06:00", "close": "22:00" },
      "tuesday": { "open": "06:00", "close": "22:00" },
      "wednesday": { "closed": true },
      "thursday": { "open": "06:00", "close": "22:00" },
      "friday": { "open": "06:00", "close": "21:00" },
      "saturday": { "open": "08:00", "close": "18:00" },
      "sunday": { "closed": true }
    },
    "approvedAt": "2026-06-25T14:30:00.000Z",
    "updatedAt": "2026-06-25T16:00:00.000Z"
  }
]
```

Coach example is the same minus `openingHours`, plus coach-only fields:

```json
[
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Jane Smith Coaching",
    "description": "1:1 powerlifting coaching online and in person.",
    "address": {
      "line1": "45 Park Lane",
      "line2": null,
      "city": "Leeds",
      "county": "West Yorkshire",
      "postcode": "LS1 2AB",
      "country": "GB",
      "latitude": null,
      "longitude": null
    },
    "links": [
      { "label": "Website", "url": "https://example.com" }
    ],
    "specialties": ["Powerlifting", "Competition prep", "Online coaching"],
    "radiusServedKm": 25,
    "approvedAt": "2026-06-25T14:30:00.000Z",
    "updatedAt": "2026-06-25T16:00:00.000Z"
  }
]
```

---

## UI / UX requirements

### Explore page layout

- Do **not** add a new tab or top-level nav item.
- Add up to **three sections** on the existing Explore page, using the same spacing, typography, and section headers as neighbouring Explore blocks (e.g. programs, articles, or whatever Explore already shows).
- **Section titles:**
  - `Gyms`
  - `Clubs`
  - `Coaches & PTs` (or `Coaches` if space is tight)
- **Visibility rule:** `if (items.length === 0) return null` for that section — no empty states, no “Coming soon” placeholders.

### Cards & favourites

- Reuse the **existing Favourites card component and save interaction** (heart icon, persisted favourites store, haptics, etc.).
- Each listing card should show at minimum:
  - **Name** (primary)
  - **One-line location** — format: `{city}, {postcode}` or formatted address (see helper below)
  - **Optional subtitle:** truncated `description` (1–2 lines)
  - **Coaches only (optional):** first 1–2 `specialties` as small chips, or comma-separated text if chips don't match existing patterns
- Tapping a card opens a **detail screen** (new route) with full data.
- **Favourite ID:** use a stable composite key so kinds do not collide, e.g. `partner:gym:{id}`, `partner:club:{id}`, `partner:coach:{id}` — align with however favourites are keyed elsewhere in the app.

### Detail screen (per listing)

Show:

| Field | Gyms / Clubs | Coaches |
|-------|----------------|---------|
| Name | ✓ | ✓ |
| Description | ✓ (if present) | ✓ |
| Full address | ✓ | ✓ |
| Specialties | — | ✓ (chip/tag list if non-empty) |
| Radius served | — | ✓ if `radiusServedKm` set — e.g. "Serves ~25 km" |
| Opening hours | ✓ (grouped by day) | — |
| Links | ✓ tappable rows → `Linking.openURL` | ✓ |
| Map | Optional later — use `latitude`/`longitude` when populated | Same |

**Links:** render each `{ label, url }` as a row/button; open in in-app browser or system browser consistent with the rest of the app.

**Opening hours:** for each day, show either `Closed` or `{open} – {close}`; use localised day names.

### Loading & empty

- Prefer a single lightweight loading state for Explore (existing pattern) while the three fetches run.
- Failed or empty categories: **omit block**, no error toast on Explore (optional: log to analytics).

---

## Suggested helpers

```typescript
const API_BASE = __DEV__
  ? "http://localhost:3000" // or your machine IP for device testing
  : "https://temperedstrength.com";

export async function fetchGyms(): Promise<PublicGymListing[]> {
  const res = await fetch(`${API_BASE}/api/gyms`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchClubs(): Promise<PublicClubListing[]> {
  const res = await fetch(`${API_BASE}/api/clubs`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCoaches(): Promise<PublicCoachListing[]> {
  const res = await fetch(`${API_BASE}/api/coaches`);
  if (!res.ok) return [];
  return res.json();
}

export function formatAddressOneLine(address: PublicVenueAddress): string {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.postcode,
  ].filter(Boolean);
  return parts.join(", ");
}

export function formatAddressMultiLine(address: PublicVenueAddress): string {
  const lines = [
    address.line1,
    address.line2,
    [address.city, address.county].filter(Boolean).join(", "),
    address.postcode,
    address.country === "GB" ? "United Kingdom" : address.country,
  ].filter(Boolean);
  return lines.join("\n");
}

export function isOpenNow(
  openingHours: OpeningHours,
  now = new Date()
): boolean | null {
  const days: DayKey[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  ];
  const key = days[now.getDay()];
  const hours = openingHours[key];
  if (!hours) return null;
  if ("closed" in hours) return false;
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= toMinutes(hours.open) && mins < toMinutes(hours.close);
}
```

`isOpenNow` is optional for v1 — useful badge on gym/club cards (“Open now” / “Closed”).

---

## Data source (website / portal context)

- Partners self-serve via **Partner portal** on the website (`/portal/login`).
- They create gym, club, or coach profiles; submit for review; admin approves in Supabase.
- **Only `approved` rows** appear in these APIs.
- Address is structured for future map pins (`latitude` / `longitude` currently often `null`).

Website implementation reference (this repo):

| Item | Location |
|------|----------|
| API routes | `src/app/api/gyms/route.ts`, `clubs/route.ts`, `coaches/route.ts` |
| Public types & mapping | `src/lib/portal/publicApi.ts` |
| Portal entity types | `src/lib/portal/types.ts` |

---

## Acceptance criteria

- [ ] Explore fetches `/api/gyms`, `/api/clubs`, `/api/coaches` in parallel on load.
- [ ] Blocks hidden when respective array is empty or request fails.
- [ ] Gyms block shows approved gyms with name, location, favourite control.
- [ ] Clubs block shows approved clubs (same card pattern).
- [ ] Coaches block shows approved coaches (no opening hours; show specialties/radius on detail).
- [ ] Favourites persist using existing favourites storage; partner entries survive app restart.
- [ ] Detail screen shows description, address, links; gyms/clubs also show opening hours; coaches also show specialties and radius when present.
- [ ] No new tab; layout matches existing Explore sections.
- [ ] Production uses `https://temperedstrength.com`; dev can point at local website or staging.

---

## Out of scope (v1)

- Map view / geocoding (address is ready; coords may be added later on website).
- Search or filter within Explore partner blocks.
- Single-item API (`/api/gyms/[id]`) — use list + find by `id` client-side for now.
- Editing partner data from the app (website portal only).

---

## Testing checklist

1. With **no approved** listings: Explore looks as before (no new blocks).
2. Approve one gym in Supabase → only **Gyms** block appears after refresh.
3. Favourite a gym → appears in existing Favourites area with same UX as other favourited content.
4. Tap link on detail → opens URL.
5. Airplane mode / 503 → blocks hidden, Explore still usable.
