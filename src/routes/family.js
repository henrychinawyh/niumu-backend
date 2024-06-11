// 家庭管理

const Router = require("koa-router");
const { add, addRelationship, query } = require("../controlller/family");

const router = new Router({
  prefix: "/api/family",
});

// 查询家庭(按条件)
router.post("/query", query);

// 新建家庭
router.post("/add", add);

// 建立学员与家庭的关联关系
router.post("/addRelationship", addRelationship);

module.exports = router;
