// 家庭管理

const Router = require("koa-router");
const {
  add,
  addRelationship,
  query,
  queryList,
  registerMember,
  recharge,
} = require("../../controlller/family");
const {
  FAMILYPREFIX,

  QUERY,
  QUERYLIST,
  ADD,
  ADDRELATIONSHIP,
  REGISTERMEMBER,
  RECHARGE,
} = require("./route");

const router = new Router({
  prefix: FAMILYPREFIX,
});

// 查询家庭(按条件)
router.post(QUERY, query);

// 查询家庭列表
router.post(QUERYLIST, queryList);

// 新建家庭
router.post(ADD, add);

// 建立学员与家庭的关联关系
router.post(ADDRELATIONSHIP, addRelationship);

// 家庭账户办理会员
router.post(REGISTERMEMBER, registerMember);

// 充值账户
router.post(RECHARGE, recharge);

module.exports = router;
