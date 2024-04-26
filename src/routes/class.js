const Router = require("koa-router");
const { createClass, getClassList } = require("../controlller/class");

const router = new Router({
  prefix: "/api/classes",
});

// 创建班级
router.post("/createClass", createClass);

// 查询班级
router.post("/getClassList", getClassList);

module.exports = router;
