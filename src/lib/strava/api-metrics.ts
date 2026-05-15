export type StravaApiTracker = {
  apiCalls: number;
  listPages: number;
  detailFetches: number;
  activitiesScanned: number;
  detailCapHit: boolean;
  rateLimitUsage?: string;
  recordListPage(): void;
  recordDetailFetch(): void;
  recordActivityScanned(): void;
  setDetailCapHit(): void;
  setRateLimitUsage(header: string | null): void;
};

export function createStravaApiTracker(): StravaApiTracker {
  const tracker: StravaApiTracker = {
    apiCalls: 0,
    listPages: 0,
    detailFetches: 0,
    activitiesScanned: 0,
    detailCapHit: false,
    rateLimitUsage: undefined,
    recordListPage() {
      this.listPages++;
    },
    recordDetailFetch() {
      this.detailFetches++;
    },
    recordActivityScanned() {
      this.activitiesScanned++;
    },
    setDetailCapHit() {
      this.detailCapHit = true;
    },
    setRateLimitUsage(header) {
      if (header) this.rateLimitUsage = header;
    },
  };
  return tracker;
}

export function logSyncMetrics(
  deviceToken: string,
  metrics: {
    apiCalls: number;
    listPages: number;
    detailFetches: number;
    activitiesScanned: number;
    detailCapHit: boolean;
    durationMs: number;
    rateLimitUsage?: string;
    isFirstSync: boolean;
  }
): void {
  if (process.env.NODE_ENV === "production") return;

  console.info("[strava/sync]", {
    deviceTokenPrefix: deviceToken.slice(0, 8),
    ...metrics,
  });
}
