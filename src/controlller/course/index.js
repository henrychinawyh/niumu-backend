const { commonResult, commonServerWrongResult } = require("../common");
const {
  addCourse,
  queryCourseList,
  delCourse,
  edit,
  getGrade,
  delGrade,
  editGrade,
  getAllCourses,
  getAllSubjects,
} = require("../../service/course");

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

  // 获取所有课程
  async getAll(ctx, next) {
    try {
      const res = await getAllCourses(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取所有课程失败：${err}`);
    }
  }

  // 删除课程
  async deleteCourse(ctx, next) {
    try {
      const res = await delCourse(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `删除课程失败：${err}`);
    }
  }

  // 编辑课程
  async editCourse(ctx, next) {
    try {
      const res = await edit(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `编辑课程失败：${err}`);
    }
  }

  // 获取课程的级别
  async getCourseGrade(ctx, next) {
    try {
      const res = await getGrade(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取课程级别失败：${err}`);
    }
  }

  // 删除课程的级别
  async deleteCourseGrade(ctx, next) {
    try {
      const res = await delGrade(ctx.request.body);
      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `删除课程级别失败：${err}`);
    }
  }

  // 编辑课程级别
  async editCourseGrade(ctx, next) {
    try {
      const res = await editGrade(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `编辑课程级别失败：${err}`);
    }
  }

  // 获取课程-级别-班级信息
  async queryAllSubjects(ctx, next) {
    try {
      const res = await getAllSubjects(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `编辑课程级别失败：${err}`);
    }
  }
}

module.exports = new CourseController();
