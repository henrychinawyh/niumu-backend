const redis = require("../../config/redis.default");

// 字符串
const set = async (key, value) => {
  await redis.set(key, value);
  return true;
};

// 默认redis国企时间为2小时
const setExpire = async (key, value, time = 7200) => {
  await redis.setex(key, time, value);
  return true;
};
const get = async (key) => {
  return await redis.get(key);
};

module.exports = {
  set,
  get,
  setExpire,
};
