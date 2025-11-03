// src/config/redis.ts

import { tick } from "api/connection/route";
import Redis from "ioredis";
import { RedisKey } from "utils/data";

// 환경 변수 설정
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
const REDIS_DB = parseInt(process.env.REDIS_DB || "0", 0);
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Redis 인스턴스 생성
const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: REDIS_DB,
  retryStrategy: (times) => {
    // 재접속 시도 로직 (필요 시)
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("connect", () => {
  console.log("ioredis connected successfully!");
});

redisClient.on("error", (err) => {
  console.error("ioredis Client Error", err);
});
const subClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: REDIS_DB,
  retryStrategy: (times) => {
    // 재접속 시도 로직 (필요 시)
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
subClient.subscribe(`__keyevent@${REDIS_DB}__:expired`, (err, count) => {
  if (err) console.error(err);
  console.log(`Subscribed to ${count} channel(s).`);
});
subClient.on("message", async (channel, key) => {
  if (channel === `__keyevent@${REDIS_DB}__:expired`) {
    if (key.startsWith("active_user:")) {
      const _key = key.split(":")[1];
      await redisClient.srem(RedisKey.users, _key);
      const wait = await redisClient.lpop(RedisKey.waiting);
      if (wait) {
        await redisClient.sadd(RedisKey.users, wait);
        await redisClient.setex(`active_user:${wait}`, tick, 1);
        await redisClient.expire(`waiting_user:${wait}`, 0);
      }
    }
    if (key.startsWith("waiting_user:")) {
      const _key = key.split(":")[1];
      await redisClient.lrem(RedisKey.waiting, 1, _key);
    }
  }
});

export default redisClient;
