export type DistanceKey =
  | "500m"
  | "1km"
  | "1mi"
  | "2k"
  | "5km"
  | "5mi"
  | "6k"
  | "10km"
  | "10mi"
  | "40k"
  | "half"
  | "full"
  | "ultra_50k"
  | "ultra_50mi"
  | "ultra_100k"
  | "ultra_100mile";

export type Discipline = "run" | "row" | "cycle";

export type DistanceBest = {
  durationSeconds: number;
  achievedAt: string;
  stravaActivityId: string;
};

export type StravaSyncPayload = {
  syncedAt: string;
  disciplines: {
    run?: Partial<Record<DistanceKey, DistanceBest>>;
    row?: Partial<Record<DistanceKey, DistanceBest>>;
    cycle?: Partial<Record<DistanceKey, DistanceBest>>;
  };
};

export type PendingOAuthSession = {
  linkId: string;
  returnTo: string;
  createdAt: string;
};

export type StravaOAuthTokens = {
  linkId: string;
  stravaAthleteId: number;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  createdAt: string;
};

export type DeviceStravaRecord = {
  deviceToken: string;
  stravaAthleteId: number;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  createdAt: string;
  updatedAt: string;
};
