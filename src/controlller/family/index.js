const {
  addFamily,
  createRelationship,
  queryFamily,
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

  // 增加家庭
  async add(ctx, next) {
    try {
      const res = await addFamily(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取家庭列表失败：${err}`);
    }
  }

  // 增加学员与家庭的关联关系
  async addRelationship(ctx, next) {
    try {
      const res = await createRelationship(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取家庭列表失败：${err}`);
    }
  }
}

module.exports = new FamilyController();
