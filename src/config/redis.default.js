const Redis = require("ioredis");
const { REDIS_HOST } = require("../config/config.default");

// 单例模式-保证全局只有唯一一个redis实例
class NewRedis {
  static instance = null;
  static getInstance() {
    if (!NewRedis.instance) {
      NewRedis.instance = new Redis({
        host: REDIS_HOST,
        port: 6379,
      });
    }
    return NewRedis.instance;
  }
}

const redis = NewRedis.getInstance();

redis.on("error", (err) => {
  console.log("redis error", err);
});

redis.on("connect", () => {
  console.log("redis connect");
});

module.exports = redis;
