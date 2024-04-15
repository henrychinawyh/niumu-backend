const { commonResult, commonServerWrongResult } = require("../common");
const { addCourse, queryCourseList } = require("../../service/course");

class CourseController {
  // 新建课程
  async createCourse(ctx, next) {
    try {
      const res = await addCourse(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `新建课程失败：${err}`);
    }
  }

  // 获取课程列表
  async getCourseList(ctx, next) {
    try {
      const res = await queryCourseList(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取课程列表失败：${err}`);
    }
  }
}

module.exports = new CourseController();
