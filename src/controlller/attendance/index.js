/**
 * @name 考勤管理Controller
 */

const {
  queryAttendanceList,
  createAttendanceRecord,
} = require("../../service/attendance");
const { commonResult, commonServerWrongResult } = require("../common");

class AttendanceController {
  // 查询考勤列表
  async getAttendanceList(ctx, next) {
    const data = ctx.request.body;

    try {
      const res = await queryAttendanceList(data);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取考勤列表失败：${err}`);
    }
  }

  // 创建考勤记录
  async createAttendance(ctx, next) {
    const data = ctx.request.body;

    try {
      const res = await createAttendanceRecord(data);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `创建考勤失败：${err}`);
    }
  }
}

module.exports = new AttendanceController();
