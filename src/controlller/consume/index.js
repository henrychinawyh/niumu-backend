const {
  reduceAccountBalance,
  addFamilyPurchaseRecord,
  getStudentConsumeRecord,
  getFamilyConsumeRecord,
} = require("../../service/consume");
const { queryAccountBalanceSql } = require("../../service/consume/sql/query");
const { responseObject } = require("../../utils");
const { compareArrayWithMin } = require("../../utils/database");
const { commonResult, commonServerWrongResult } = require("../common");

class ConsumeController {
  // 查询家庭账户余额
  async queryAccountBalance(ctx, next) {
    try {
      const data = ctx.request.body;
      const res = await exec(queryAccountBalanceSql(data));

      commonResult(ctx, {
        status: 200,
        data: responseObject(res),
        message: "查询成功",
      });
    } catch (err) {
      commonServerWrongResult(ctx, `获取账户失败：${err}`);
    }
  }

  // 增加消费记录
  async addExtraConsume(ctx, next) {
    const data = ctx.request.body;
    const balances = await next();
    try {
      // 判断家庭余额是否充足
      let cantConsumeStudent = [];
      data?.studentInfos?.forEach((item) => {
        let itemBalance = balances.filter(
          (balance) => +balance.familyId === +item.familyId,
        )[0]?.accountBalance;

        if (+itemBalance < item?.actualPrice) {
          cantConsumeStudent.push(item.stuName);
        }
      });
      if (compareArrayWithMin(cantConsumeStudent)) {
        return commonServerWrongResult(
          ctx,
          `${cantConsumeStudent?.join("，")} 家庭账户余额不足，无法完成本次消费`,
        );
      }

      // 家庭消费充足的情况
      // 1. 减少家庭账户余额
      // 1.1 确认是否要取消会员资格
      // 1.2 增加家庭消费记录
      await reduceAccountBalance(data);

      commonResult(ctx, {
        status: 200,
        data: true,
        message: "操作成功",
      });
    } catch (err) {
      commonServerWrongResult(ctx, `增加消费记录失败：${err}`);
    }
  }

  // 查看学员消费记录
  async queryStudentConsumeRecord(ctx, next) {
    try {
      const res = await getStudentConsumeRecord(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `查看学员消费记录失败：${err}`);
    }
  }

  // 查看家庭消费记录
  async queryFamilyConsumeRecord(ctx, next) {
    try {
      const res = await getFamilyConsumeRecord(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `查看家庭消费记录失败：${err}`);
    }
  }
}

module.exports = new ConsumeController();
