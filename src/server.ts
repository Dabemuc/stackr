import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";
import { createClerkHandler } from "@clerk/tanstack-react-start/server";

const startHandlerFactory = createStartHandler({
  createRouter,
});

const clerkHandlerFactory = createClerkHandler(startHandlerFactory);

export default defineHandlerCallback(async (event) => {
  const handler = await clerkHandlerFactory(defaultStreamHandler);
  return handler(event);
});
