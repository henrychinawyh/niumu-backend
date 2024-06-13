const {
  addFamily,
  createRelationship,
  queryFamily,
  queryFamilyList,
  createMember,
  rechargeAccount,
} = require("../../service/family");
const { commonResult, commonServerWrongResult } = require("../common");

class FamilyController {
  // 查询家庭(按条件)
  async query(ctx, next) {
    try {
      const res = await queryFamily(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取家庭列表失败：${err}`);
    }
  }

  // 查询家庭列表
  async queryList(ctx, next) {
    try {
      const res = await queryFamilyList(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取家庭列表失败：${err}`);
    }
  }

  // 增加家庭
  async add(ctx, next) {
    try {
      const res = await addFamily(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `添加家庭失败：${err}`);
    }
  }

  // 增加学员与家庭的关联关系
  async addRelationship(ctx, next) {
    try {
      const res = await createRelationship(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `添加学员与家庭的关联关系失败：${err}`);
    }
  }

  // 家庭账户办理会员
  async registerMember(ctx, next) {
    try {
      const res = await createMember(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `家庭账户办理会员失败：${err}`);
    }
  }

  // 充值账户
  async recharge(ctx, next) {
    try {
      const res = await rechargeAccount(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `充值账户失败：${err}`);
    }
  }
}

module.exports = new FamilyController();
