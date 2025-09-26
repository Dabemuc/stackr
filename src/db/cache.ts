import { logger } from "@/logging/logger";
import { upstashCache } from "drizzle-orm/cache/upstash";

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getCacheConf() {
  let cacheConfig;

  if (process.env.NODE_ENV === "development") {
    logger.info("Checking localdeployment cache availability...");

    const localUrl = "http://localhost:8079";
    const reachable = await isReachable(localUrl);

    if (reachable) {
      logger.info("Utilizing localdeployment cache ...");
      cacheConfig = upstashCache({
        url: localUrl,
        token: "example_token",
        global: true,
        config: {
          ex: 60 * 60 * 24, // 24h TTL
        },
      });
    } else {
      logger.warn("Local cache not reachable. Skipping!");
    }
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
        ex: 60 * 60 * 24,
      },
    });
  } else {
    logger.warn("Can't initialize cache. Skipping!");
  }

  return cacheConfig;
}
