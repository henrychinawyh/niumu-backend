const { addClass, getClass } = require("../../service/class");
const { commonResult, commonServerWrongResult } = require("../common");

class ClassController {
  // 新建班级
  async createClass(ctx, next) {
    try {
      const res = await addClass(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `新建班级失败：${err}`);
    }
  }

  // 查询班级
  async getClassList(ctx, next) {
    try {
      const res = await getClass(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `查询班级失败：${err}`);
    }
  }
}

module.exports = new ClassController();
