export type BriefIntent = {
  need?: string;
  engagement?: string;
};

export const BRIEF_INTENT_EVENT = "virtus:brief-intent";

const STORAGE_KEY = "virtus:brief-intent";

export function readBriefIntent(): BriefIntent {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as BriefIntent;

    return {
      need: typeof parsed.need === "string" ? parsed.need : undefined,
      engagement:
        typeof parsed.engagement === "string" ? parsed.engagement : undefined,
    };
  } catch {
    return {};
  }
}

export function writeBriefIntent(next: BriefIntent) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readBriefIntent();

  const merged = {
    ...current,
    ...next,
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

  window.dispatchEvent(
    new CustomEvent<BriefIntent>(BRIEF_INTENT_EVENT, {
      detail: merged,
    }),
  );
}

export function clearBriefIntent() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
