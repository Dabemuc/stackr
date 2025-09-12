import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { Roles } from "@/global-types";
import { logger } from "@/logging/logger";

/**
 * Enforces Clerk authentication on the current request. Server Side only!!!.
 *
 * @param options.mode "redirect" → redirect to sign-in
 *                     "api"      → throw 401 Response
 */
export async function requireAuth(
  options: { mode?: "redirect" | "api"; role?: Roles } = {},
) {
  const request = getWebRequest();
  if (!request) {
    throw new Error("No request found");
  }

  const { userId, sessionId, sessionClaims } = await getAuth(request);

  function doBlock() {
    if (options.mode === "api") {
      // For API/server endpoints
      throw new Response("Unauthorized", { status: 401 });
    } else {
      // For page navigations
      throw redirect({
        to: "/",
      });
    }
  }

  if (!userId) {
    logger.warn("Unauthenticated attempt to access", request.url);
    doBlock();
  }

  if (options.role && sessionClaims?.metadata.role !== options.role) {
    logger.warn(
      "Unauthorized attempt to access",
      request.url,
      "\nUserid:",
      userId,
      "\nRole:",
      sessionClaims?.metadata.role,
    );
    doBlock();
  }

  logger.info(
    "Authorized request for",
    request.url,
    "\nuserid:",
    userId,
    "\sessionId:",
    sessionId,
    "\sessionClaims:",
    sessionClaims,
  );
  return { userId, sessionId };
}
