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
const {
  CONSUMEPREFIX,
  QUERYACCOUNTBALANCE,
  ADDEXTRACONSUME,
  QUERYSTUDENTCONSUMERECORD,
  QUERYFAMILYCONSUMERECORD,
} = require("./route");

const router = new Router({
  prefix: CONSUMEPREFIX,
});

// 获取家庭消费
router.post(QUERYACCOUNTBALANCE, queryAccountBalance);

// 增加课外消费记录
router.post(
  ADDEXTRACONSUME,
  addExtraConsume,
  queryAccountBalanceBeforeAddRecord,
);

// 查看学员消费记录
router.post(QUERYSTUDENTCONSUMERECORD, queryStudentConsumeRecord);

// 查看家庭消费记录
router.post(QUERYFAMILYCONSUMERECORD, queryFamilyConsumeRecord);

module.exports = router;
