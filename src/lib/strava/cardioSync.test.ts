import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  distanceMatchesPreset,
  matchPreset,
} from "./cardioDistances";
import { buildStravaSyncPayloadFromActivities } from "./cardioSync";
import type { StravaActivitySummary } from "./client";

function runActivity(
  id: number,
  distance: number,
  movingTime: number,
  startDate = "2025-06-01T08:00:00Z"
): StravaActivitySummary {
  return {
    id,
    type: "Run",
    distance,
    moving_time: movingTime,
    elapsed_time: movingTime,
    start_date: startDate,
  };
}

describe("distanceMatchesPreset", () => {
  it("matches ~50k run within 3% tolerance", () => {
    assert.equal(distanceMatchesPreset(50120, 50000), true);
  });

  it("matches ~50 mile run within 3% tolerance", () => {
    assert.equal(distanceMatchesPreset(80500, 80467.2), true);
  });

  it("does not match marathon to ultra_50k", () => {
    const ultra50k = CARDIO_DISTANCES_BY_DISCIPLINE.run.find(
      (p) => p.key === "ultra_50k"
    )!;
    assert.notEqual(
      matchPreset(42195, CARDIO_DISTANCES_BY_DISCIPLINE.run, true)?.key,
      "ultra_50k"
    );
    assert.equal(distanceMatchesPreset(42195, ultra50k.meters), false);
  });
});

describe("buildStravaSyncPayloadFromActivities", () => {
  it("returns ultra_50k and ultra_50mi for qualifying runs", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(12345678, 50120, 16320),
      runActivity(87654321, 80500, 32400, "2025-07-01T08:00:00Z"),
    ]);

    assert.deepEqual(disciplines.run?.ultra_50k, {
      durationSeconds: 16320,
      achievedAt: "2025-06-01T08:00:00Z",
      stravaActivityId: "12345678",
    });
    assert.deepEqual(disciplines.run?.ultra_50mi, {
      durationSeconds: 32400,
      achievedAt: "2025-07-01T08:00:00Z",
      stravaActivityId: "87654321",
    });
  });

  it("keeps the fastest 50k when two qualify", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(1, 50050, 20000),
      runActivity(2, 50100, 15000),
    ]);

    assert.equal(disciplines.run?.ultra_50k?.durationSeconds, 15000);
    assert.equal(disciplines.run?.ultra_50k?.stravaActivityId, "2");
  });

  it("returns 5km from best_efforts, not activity distance", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities(
      [runActivity(99, 5200, 9999)],
      {
        "99": [
          {
            distance: 5000,
            elapsed_time: 1200,
            start_date: "2025-01-01T10:00:00Z",
          },
        ],
      }
    );

    assert.deepEqual(disciplines.run?.["5km"], {
      durationSeconds: 1200,
      achievedAt: "2025-01-01T10:00:00Z",
      stravaActivityId: "99",
    });
    assert.equal(disciplines.run?.ultra_50k, undefined);
  });

  it("does not treat marathon distance as ultra_50k", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(42, 42195, 10800),
    ]);

    assert.equal(disciplines.run?.ultra_50k, undefined);
    assert.equal(disciplines.run?.full, undefined);
  });
});
