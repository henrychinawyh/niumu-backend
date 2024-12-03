const Router = require("koa-router");
const { add } = require("../../controlller/purchase");
const { PURCHASEPREFIX, ADD } = require("./route");

const router = new Router({
  prefix: PURCHASEPREFIX,
});

// 给学员添加课时
router.post(ADD, add);

module.exports = router;
