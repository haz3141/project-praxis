export const UI_PREFERENCES_KEY = "praxis-ui-preferences-v1";

export type ThemeName = "light" | "dark" | "liquid-neon";
export type DensityMode = "comfortable" | "compact";

export type UiPreferences = {
  theme: ThemeName;
  density: DensityMode;
  reducedMotion: boolean;
};

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  theme: "liquid-neon",
  density: "comfortable",
  reducedMotion: false
};

function isTheme(value: unknown): value is ThemeName {
  return value === "light" || value === "dark" || value === "liquid-neon";
}

function isDensity(value: unknown): value is DensityMode {
  return value === "comfortable" || value === "compact";
}

export function parseUiPreferences(payload: unknown): UiPreferences {
  if (!payload || typeof payload !== "object") {
    return DEFAULT_UI_PREFERENCES;
  }

  const candidate = payload as Partial<UiPreferences>;

  return {
    theme: isTheme(candidate.theme) ? candidate.theme : DEFAULT_UI_PREFERENCES.theme,
    density: isDensity(candidate.density) ? candidate.density : DEFAULT_UI_PREFERENCES.density,
    reducedMotion: typeof candidate.reducedMotion === "boolean" ? candidate.reducedMotion : false
  };
}

export function readUiPreferences(): UiPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_UI_PREFERENCES;
  }

  const raw = window.localStorage.getItem(UI_PREFERENCES_KEY);
  if (!raw) {
    return DEFAULT_UI_PREFERENCES;
  }

  try {
    return parseUiPreferences(JSON.parse(raw));
  } catch {
    return DEFAULT_UI_PREFERENCES;
  }
}

export function saveUiPreferences(preferences: UiPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(preferences));
}

export function applyUiPreferencesToDocument(preferences: UiPreferences): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute("data-theme", preferences.theme);
  root.setAttribute("data-density", preferences.density);
  root.setAttribute("data-reduced-motion", preferences.reducedMotion ? "true" : "false");
}
