import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { UiPreferencesHydrator } from "@/components/ui-preferences-hydrator";
import "@/app/globals.css";
import "@praxis/design-tokens/dist/tokens.css";
import "@praxis/ui/src/styles.css";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export const metadata: Metadata = {
  title: "Praxis Planner",
  description: "Capture, commit, complete, and review.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="liquid-neon" data-density="comfortable">
      <body>
        <UiPreferencesHydrator />
        <ServiceWorkerRegistration />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
