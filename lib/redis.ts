import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be defined"
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export interface UsageRecord {
  sitemapUrl: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
}

export async function trackUsage(usage: UsageRecord) {
  try {
    const key = `usage:${Date.now()}:${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await redis.set(key, usage, { ex: 60 * 60 * 24 * 30 }); // Expire after 30 days

    // Increment total usage counter
    await redis.incr("total_usage_count");

    // Add to recent usage list (keep last 100)
    await redis.lpush("recent_usage", JSON.stringify(usage));
    await redis.ltrim("recent_usage", 0, 99);

    console.log("Usage tracked successfully:", usage);
  } catch (error) {
    console.error("Error tracking usage:", error);
  }
}

export async function getUsageStats() {
  try {
    const totalCount = (await redis.get("total_usage_count")) || 0;
    const recentUsage = await redis.lrange("recent_usage", 0, 9); // Get last 10

    return {
      totalCount: Number(totalCount),
      recentUsage: recentUsage.map((usage) => JSON.parse(usage)),
    };
  } catch (error) {
    console.error("Error getting usage stats:", error);
    return { totalCount: 0, recentUsage: [] };
  }
}
