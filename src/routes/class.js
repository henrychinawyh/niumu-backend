const Router = require("koa-router");
const { createClass } = require("../controlller/class");

const router = new Router({
  prefix: "/api/classes",
});

// 创建班级
router.post("/createClass", createClass);

module.exports = router;
