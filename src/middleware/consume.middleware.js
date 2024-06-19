const { exec } = require("../db/seq");
const { commonServerWrongResult } = require("../controlller/common");
const { queryAccountBalancesSql } = require("../service/consume/sql/query");

// 增加消费记录前获取家庭账户余额
const queryAccountBalanceBeforeAddRecord = async (ctx, next) => {
  try {
    const { studentInfos } = ctx.request.body;

    const res = await exec(
      queryAccountBalancesSql({
        familyIds: studentInfos
          ?.filter((item) => !!item?.familyId)
          ?.map((item) => item?.familyId),
      }),
    );

    await next();

    return res;
  } catch (err) {
    commonServerWrongResult(ctx, `获取账户失败：${err}`);
  }
};

module.exports = {
  queryAccountBalanceBeforeAddRecord,
};
