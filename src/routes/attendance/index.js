/**
 * @name 考勤管理
 */

const Router = require("koa-router");
const {
  getAttendanceList,
  createAttendance,
} = require("../../controlller/attendance");
const {
  ATTENDANCEPREFIX,
  GETATTENDANCELIST,
  CREATEATTENDANCE,
} = require("./route");

const router = new Router({
  prefix: ATTENDANCEPREFIX,
});

// 查询考勤列表
router.post(GETATTENDANCELIST, getAttendanceList);

// 创建一条考勤记录
router.post(CREATEATTENDANCE, createAttendance);

module.exports = router;
