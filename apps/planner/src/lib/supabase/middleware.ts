import type { NextRequest } from "next/server";

import { updateSession } from "@praxis/supabase/middleware";

export function refreshSupabaseSession(request: NextRequest) {
  return updateSession(request);
}
