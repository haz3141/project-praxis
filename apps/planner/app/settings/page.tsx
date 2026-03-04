"use client";

import { useEffect, useState } from "react";
import {
  AtomicSelect,
  AtomicSwitch,
  Card,
  type AtomicSelectOption
} from "@praxis/ui";
import {
  applyUiPreferencesToDocument,
  DEFAULT_UI_PREFERENCES,
  readUiPreferences,
  saveUiPreferences,
  type DensityMode,
  type ThemeName,
  type UiPreferences
} from "@/lib/ui-preferences";

const THEME_OPTIONS: AtomicSelectOption[] = [
  { label: "Liquid Neon", value: "liquid-neon" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" }
];

const DENSITY_OPTIONS: AtomicSelectOption[] = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" }
];

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UiPreferences>(DEFAULT_UI_PREFERENCES);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const initial = readUiPreferences();
    setPreferences(initial);
    applyUiPreferencesToDocument(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    applyUiPreferencesToDocument(preferences);
    saveUiPreferences(preferences);
  }, [isReady, preferences]);

  return (
    <div className="card-grid">
      <Card
        as="section"
        title="Display"
        description="Choose a theme and density mode. Preferences are saved locally on this device."
      >
        <div className="inline-form">
          <AtomicSelect
            id="settings-theme"
            label="Theme"
            value={preferences.theme}
            options={THEME_OPTIONS}
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                theme: event.currentTarget.value as ThemeName
              }));
            }}
          />

          <AtomicSelect
            id="settings-density"
            label="Density"
            value={preferences.density}
            options={DENSITY_OPTIONS}
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                density: event.currentTarget.value as DensityMode
              }));
            }}
          />
        </div>
      </Card>

      <Card
        as="section"
        title="Accessibility"
        description="Keep motion low when switching context and moving across surfaces."
      >
        <AtomicSwitch
          id="settings-reduced-motion"
          label="Reduce motion"
          description="Applies reduced-motion preference to planner UI data attributes."
          checked={preferences.reducedMotion}
          onChange={(event) => {
            setPreferences((current) => ({
              ...current,
              reducedMotion: event.currentTarget.checked
            }));
          }}
        />
      </Card>
    </div>
  );
}
