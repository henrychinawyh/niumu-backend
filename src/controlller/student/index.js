const {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
} = require("../../service/student");
const { commonResult, commonServerWrongResult } = require("../common");

class StudentController {
  // 获取学员列表
  async getStudentList(ctx, next) {
    try {
      const res = await queryStudent(ctx.request.body);

      commonResult(ctx, {
        status: 200,
        data: res,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `获取学员列表失败：${err}`);
    }
  }

  // 获取单个学员
  async getStudent(ctx, next) {
    try {
      const res = await queryOneStudent(ctx.request.body);

      commonResult(ctx, {
        status: 200,
        data: res,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `获取单个学员失败：${err}`);
    }
  }

  // 新建学员
  async createStudent(ctx, next) {
    try {
      const res = await addStudent(ctx.request.body);

      if (res && res.affectedRows > 0) {
        commonResult(ctx, {
          status: 200,
          message: "新建成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `新建学员失败：${err}`);
    }
  }

  // 编辑学员
  async editStudent(ctx, next) {
    ctx.body = "编辑学员";
  }

  // 删除学员
  async deleteStudent(ctx, next) {
    try {
      const res = await removeStudent(ctx.request.body);

      if (res.length > 0) {
        commonResult(ctx, {
          status: 200,
          message: "删除成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `删除学员失败：${err}`);
    }
  }
}

module.exports = new StudentController();
