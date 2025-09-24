import { logger } from "@/logging/logger";
import { upstashCache } from "drizzle-orm/cache/upstash";

export function getCacheConf() {
  let cacheConfig = undefined;

  // Use localdeployment cache if in dev env, else attempt to use upstash cache
  if (process.env.NODE_ENV === "development") {
    logger.info("Utilizing localdeployment cache ...");
    cacheConfig = upstashCache({
      url: "http://localhost:8079",
      token: "example_token",
      global: true,
      config: {
        ex: 60 * 60 * 24, // Ttl of 24 hours
      },
    });
  } else if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    logger.info("Utilizing Upstash cache ...");
    cacheConfig = upstashCache({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      global: true,
      config: {
        ex: 60 * 60 * 24, // Ttl of 24 hours
      },
    });
  } else logger.warn("Can't initialize cache. Skipping!");

  return cacheConfig;
}
