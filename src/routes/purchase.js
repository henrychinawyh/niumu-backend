const Router = require("koa-router");
const { add } = require("../controlller/purchase");

const router = new Router({
  prefix: "/api/purchase",
});

// 给学员添加课时
router.post("/add", add);

module.exports = router;
