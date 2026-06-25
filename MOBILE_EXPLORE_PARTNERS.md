# Mobile app: optional club opening hours

Some clubs have no fixed schedule. The API now exposes this explicitly.

## API

`GET /api/clubs` — each club includes:

```typescript
export type PublicClubListing = PublicListingBase & {
  hasOpeningHours: boolean;
  openingHours?: OpeningHours; // only when hasOpeningHours is true
  hideLocation: boolean;
  // ...other fields you already handle
};
```

Gyms are unchanged — `openingHours` is always present on `PublicGymListing`.

## When `hasOpeningHours` is `false`

`openingHours` is **omitted** from the JSON (not `{}`):

```json
{
  "id": "…",
  "name": "Example Club",
  "hasOpeningHours": false,
  "hideLocation": false,
  "address": { … },
  "links": []
}
```

## App behaviour

- **Club detail:** hide the opening hours section when `hasOpeningHours === false`.
- **Club cards:** do not show “Open now” or any hours badge when `hasOpeningHours === false`.
- **Parsing:** use `club.hasOpeningHours` — do not infer from missing/empty `openingHours`.

## Helper

```typescript
export function clubShowsHours(club: PublicClubListing): boolean {
  return club.hasOpeningHours && club.openingHours != null;
}
```

## Checklist

- [ ] `PublicClubListing` type includes `hasOpeningHours: boolean`
- [ ] `openingHours` is optional on the type
- [ ] Club detail skips hours UI when `hasOpeningHours === false`
- [ ] Club cards skip hours badges when `hasOpeningHours === false`
