import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  matchPreset,
  TOLERANCE_ULTRA,
  toleranceForKey,
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

describe("matchPreset", () => {
  it("matches ultra_50k at ~50120 m with 5% ultra tolerance", () => {
    const matched = matchPreset(
      50120,
      CARDIO_DISTANCES_BY_DISCIPLINE.run,
      "full_activity"
    );
    assert.equal(matched?.key, "ultra_50k");
  });

  it("matches full (marathon) at 42195 m on whole activity", () => {
    const matched = matchPreset(
      42195,
      CARDIO_DISTANCES_BY_DISCIPLINE.run,
      "full_activity"
    );
    assert.equal(matched?.key, "full");
  });

  it("does not match marathon to ultra_50k when both in range", () => {
    const matched = matchPreset(
      42195,
      CARDIO_DISTANCES_BY_DISCIPLINE.run,
      "full_activity"
    );
    assert.notEqual(matched?.key, "ultra_50k");
  });

  it("uses 5% tolerance for ultra keys only", () => {
    assert.equal(toleranceForKey("ultra_50k"), TOLERANCE_ULTRA);
    assert.equal(toleranceForKey("full"), 0.03);
  });
});

describe("buildStravaSyncPayloadFromActivities", () => {
  it("returns half, full, and ultra_50k from whole-activity runs", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(111, 21097, 6300, "2025-03-01T08:00:00Z"),
      runActivity(222, 42195, 13500, "2025-04-01T08:00:00Z"),
      runActivity(333, 50120, 16320, "2025-05-01T08:00:00Z"),
    ]);

    assert.equal(disciplines.run?.half?.stravaActivityId, "111");
    assert.equal(disciplines.run?.half?.durationSeconds, 6300);
    assert.equal(disciplines.run?.full?.stravaActivityId, "222");
    assert.equal(disciplines.run?.full?.durationSeconds, 13500);
    assert.equal(disciplines.run?.ultra_50k?.stravaActivityId, "333");
    assert.equal(disciplines.run?.ultra_50k?.durationSeconds, 16320);
  });

  it("returns marathon activity as full, not ultra_50k", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(42, 42195, 10800),
    ]);

    assert.equal(disciplines.run?.full?.durationSeconds, 10800);
    assert.equal(disciplines.run?.full?.stravaActivityId, "42");
    assert.equal(disciplines.run?.ultra_50k, undefined);
  });

  it("keeps the fastest 50k when two qualify", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities([
      runActivity(1, 50050, 20000),
      runActivity(2, 50100, 15000),
    ]);

    assert.equal(disciplines.run?.ultra_50k?.durationSeconds, 15000);
    assert.equal(disciplines.run?.ultra_50k?.stravaActivityId, "2");
  });

  it("returns 5km from best_efforts, not whole-activity distance", () => {
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

  it("prefers faster time when half comes from activity and best_effort", () => {
    const { disciplines } = buildStravaSyncPayloadFromActivities(
      [runActivity(7, 21100, 7000)],
      {
        "7": [
          {
            distance: 21097.5,
            elapsed_time: 6500,
            start_date: "2025-02-01T08:00:00Z",
          },
        ],
      }
    );

    assert.equal(disciplines.run?.half?.durationSeconds, 6500);
  });
});
