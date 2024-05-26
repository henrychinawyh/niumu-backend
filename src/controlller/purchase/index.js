const { addPurchaseRecord } = require("../../service/purchase");
const { commonResult, commonServerWrongResult } = require("../common");

class PurchaseController {
  // 给学员添加课时
  async add(ctx, next) {
    const data = ctx.request.body;
    try {
      const res = await addPurchaseRecord(data);

      commonResult(ctx, {
        status: 200,
        data: res,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `新建课时记录失败：${err}`);
    }
  }
}

module.exports = new PurchaseController();
