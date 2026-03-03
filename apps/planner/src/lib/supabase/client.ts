import { createBrowserClient } from "@praxis/supabase/client";

export function getSupabaseBrowserClient() {
  return createBrowserClient();
}
