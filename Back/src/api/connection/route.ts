import redisClient from "redis";
import { RedisKey } from "utils/data";
import { generateShortId, generateToken, verifyToken } from "utils/functions";

let MAX_CAPACITY = parseInt(process.env.MAX_CAPACITY || "10000", 10) || 1000;
MAX_CAPACITY = 1;
export const tick = 16;

export const GET: ApiHandler = async (req, res) => {
  let { key } = req.parsedQuery;

  if (key && verifyToken(key)) {
    key = verifyToken(key).key;
    if (await redisClient.exists(`active_user:${key}`)) {
      await redisClient.expire(`active_user:${key}`, tick);
      return res.json({});
    } else if (await redisClient.exists(`waiting_user:${key}`)) {
      await redisClient.expire(`waiting_user:${key}`, tick);
      const waiting = await redisClient.lpos(RedisKey.waiting, key);
      return res.json({ waiting });
    }
  }
  key = generateShortId(64) + "_" + new Date().getTime().toString();

  const count = await redisClient.scard(RedisKey.users);
  if (count < MAX_CAPACITY) {
    // 접속
    await redisClient.setex(`active_user:${key}`, tick, 1);
    await redisClient.sadd(RedisKey.users, key);

    return res.json({ key: generateToken({ key }) });
  } else {
    await redisClient.setex(`waiting_user:${key}`, tick, 1);
    await redisClient.rpush(RedisKey.waiting, key);
    const waiting = await redisClient.lpos(RedisKey.waiting, key);

    return res.json({ waiting, key: generateToken({ key }) });
  }
};
export const DELETE: ApiHandler = async (req, res) => {
  let { key } = req.parsedQuery;
  if (key && verifyToken(key)) {
    key = verifyToken(key).key;
    if (await redisClient.exists(`active_user:${key}`)) {
      await redisClient.expire(`active_user:${key}`, 1);
    }
    if (await redisClient.exists(`waiting_user:${key}`)) {
      await redisClient.expire(`waiting_user:${key}`, 1);
    }
  }

  return res.json({});
};
export const SOCKET: SocketHandler = async (socket, io, url, data) => {};
