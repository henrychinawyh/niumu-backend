const Router = require("koa-router");
const {
  queryAccountBalanceBeforeAddRecord,
} = require("../../middleware/consume.middleware");
const {
  queryAccountBalance,
  addExtraConsume,
  queryStudentConsumeRecord,
  queryFamilyConsumeRecord,
} = require("../../controlller/consume");

const router = new Router({
  prefix: "/api/consume",
});

// 获取家庭消费
router.post("/queryAccountBalance", queryAccountBalance);

// 增加课外消费记录
router.post(
  "/addExtraConsume",
  addExtraConsume,
  queryAccountBalanceBeforeAddRecord,
);

// 查看学员消费记录
router.post("/queryStudentConsumeRecord", queryStudentConsumeRecord);

// 查看家庭消费记录
router.post("/queryFamilyConsumeRecord", queryFamilyConsumeRecord);

module.exports = router;
