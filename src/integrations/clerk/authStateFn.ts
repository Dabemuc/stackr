import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./requireAuth.server";

/**
 * Method to request auth state that is meant to be used on client/ in beforeLoad
 */
export const authStateFn = createServerFn({ method: "GET" }).handler(
  async () => await requireAuth({ mode: "redirect", role: "admin" }),
);
