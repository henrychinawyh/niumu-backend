/**
 * @name 考勤管理
 */

const Router = require("koa-router");
const { getAttendanceList } = require("../controlller/attendance");

const router = new Router({
  prefix: "/api/attendance",
});

// 查询考勤列表
router.post("/getAttendanceList", getAttendanceList);

module.exports = router;
