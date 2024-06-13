// 家庭管理

const Router = require("koa-router");
const {
  add,
  addRelationship,
  query,
  queryList,
  registerMember,
  recharge,
} = require("../controlller/family");

const router = new Router({
  prefix: "/api/family",
});

// 查询家庭(按条件)
router.post("/query", query);

// 查询家庭列表
router.post("/queryList", queryList);

// 新建家庭
router.post("/add", add);

// 建立学员与家庭的关联关系
router.post("/addRelationship", addRelationship);

// 家庭账户办理会员
router.post("/registerMember", registerMember);

// 充值账户
router.post("/recharge", recharge);

module.exports = router;
