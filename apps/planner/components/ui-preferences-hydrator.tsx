"use client";

import { useEffect } from "react";
import {
  applyUiPreferencesToDocument,
  readUiPreferences
} from "@/lib/ui-preferences";

export function UiPreferencesHydrator() {
  useEffect(() => {
    applyUiPreferencesToDocument(readUiPreferences());
  }, []);

  return null;
}
