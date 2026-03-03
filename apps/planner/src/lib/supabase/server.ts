import "server-only";

import { createServerClient } from "@praxis/supabase/server";

export async function getSupabaseServerClient(_useServiceRole = false) {
  return createServerClient();
}
