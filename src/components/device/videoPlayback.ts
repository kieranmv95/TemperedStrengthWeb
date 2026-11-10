const MAX_PLAYING = 2;

type Registration = {
  ratio: number;
  threshold: number;
  active: boolean;
  setActive: (active: boolean) => void;
};

const registrations = new Set<Registration>();

function reconcile() {
  const winners = [...registrations]
    .filter((entry) => entry.ratio > 0 && entry.ratio >= entry.threshold)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, MAX_PLAYING);

  for (const entry of registrations) {
    const next = winners.includes(entry);
    if (next !== entry.active) {
      entry.active = next;
      entry.setActive(next);
    }
  }
}

/**
 * Page-wide playback budget for device-frame videos. Each frame reports how
 * much of its observed element is visible; the most visible frames that clear
 * their threshold play, and everything else pauses.
 */
export function registerDeviceVideo(
  threshold: number,
  setActive: (active: boolean) => void
) {
  const entry: Registration = { ratio: 0, threshold, active: false, setActive };
  registrations.add(entry);

  return {
    update(ratio: number) {
      entry.ratio = ratio;
      reconcile();
    },
    unregister() {
      registrations.delete(entry);
      reconcile();
    },
  };
}
