const { commonResult } = require("../../controlller/common");
const {
  getRequestUrl,
  convertToRedisKey,
  formatListData,
} = require("../../utils");
const { get } = require("./index");

// 查询班级详情
const getClassDetailByRedis = async (ctx, next) => {
  const url = getRequestUrl(ctx);
  const key = convertToRedisKey(url, ctx.request.body);

  const result = await get(key);
  if (result) {
    commonResult(ctx, {
      data: formatListData(JSON.parse(result)),
      message: "查询成功",
      status: 200,
    });
  } else {
    await next();
  }
};

module.exports = {
  getClassDetailByRedis,
};
