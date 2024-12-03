/**
 * @name 考勤管理
 */

const Router = require("koa-router");
const {
  getAttendanceList,
  createAttendance,
} = require("../../controlller/attendance");

const router = new Router({
  prefix: "/api/attendance",
});

// 查询考勤列表
router.post("/getAttendanceList", getAttendanceList);

// 创建一条考勤记录
router.post("/createAttendance", createAttendance);

module.exports = router;
