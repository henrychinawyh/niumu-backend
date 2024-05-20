const {
  addClass,
  getClass,
  queryStudentOfEachClass,
  editClassByClassId,
  queryRemianCourseCount,
  delStudent,
} = require("../../service/class");
const { commonResult, commonServerWrongResult } = require("../common");

class ClassController {
  // 新建班级
  async createClass(ctx, next) {
    try {
      const res = await addClass(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `新建班级失败：${err}`);
    }
  }

  // 查询班级
  async getClassList(ctx, next) {
    try {
      const res = await getClass(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `查询班级失败：${err}`);
    }
  }

  // 查询班级中的学员
  async getStudentsInClass(ctx, next) {
    try {
      const res = await queryStudentOfEachClass(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `查询班级失败：${err}`);
    }
  }

  // 编辑班级
  async editClass(ctx, next) {
    try {
      const res = await editClassByClassId(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `编辑班级失败：${err}`);
    }
  }

  // 检查某个学员在班级中未销课时
  async hasRemianCourseCount(ctx, next) {
    try {
      const res = await queryRemianCourseCount(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `检查某个学员在班级中未销课时失败：${err}`);
    }
  }

  // 删除班级下的学员
  async deleteStudentOfClass(ctx, next) {
    try {
      const res = await delStudent(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `删除班级下的学员失败：${err}`);
    }
  }
}

module.exports = new ClassController();
