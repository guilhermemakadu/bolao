import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const authResponse = await updateSession(request);

  if (authResponse.headers.get("location")) {
    return authResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
