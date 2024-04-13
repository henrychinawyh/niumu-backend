const { commonResult, commonServerWrongResult } = require("../common");
const { addCourse } = require("../../service/course");

class CourseController {
  // 新建课程
  async createCourse(ctx, next) {
    try {
      const res = await addCourse(ctx.request.body);

      const { status, message } = res;

      commonResult(ctx, {
        status,
        message,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `新建课程失败：${err}`);
    }
  }
}

module.exports = new CourseController();
