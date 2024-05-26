/**
 * @name 考勤管理Controller
 */

const { queryAttendanceList } = require("../../service/attendance");
const { commonResult, commonServerWrongResult } = require("../common");

class AttendanceController {
  async getAttendanceList(ctx, next) {
    const data = ctx.request.body;

    try {
      const res = await queryAttendanceList(data);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取考勤列表失败：${err}`);
    }
  }
}

module.exports = new AttendanceController();
