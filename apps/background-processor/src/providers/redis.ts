import Redis from "ioredis";

const isLocalRedis = process.env.REDIS_URL?.includes("localhost");

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  ...(!isLocalRedis && {
    enableReadyCheck: false,
    tls: {
      rejectUnauthorized: false,
    },
  }),
});
