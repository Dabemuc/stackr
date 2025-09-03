import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

/**
 * Enforces Clerk authentication on the current request. Server Side only!!!.
 *
 * @param options.mode "redirect" → redirect to sign-in
 *                     "api"      → throw 401 Response
 */
export async function requireAuth(options: { mode?: "redirect" | "api" } = {}) {
  const request = getWebRequest();
  if (!request) {
    throw new Error("No request found");
  }

  const { userId, sessionId } = await getAuth(request);

  if (!userId) {
    console.log("Unauthorized attempt to access", request.url);
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

  console.log("Authorized request for", request.url);
  return { userId, sessionId };
}
