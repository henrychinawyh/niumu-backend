const {
  addTeacher,
  queryTeacher,
  edit,
  removeTeacher,
  exportTea,
  searchTeacherWithCourse,
} = require("../../service/teacher");
const { GENDER } = require("../../utils/constant");
const { exportExcel } = require("../../utils/export");
const { commonResult, commonServerWrongResult } = require("../common");
const dayjs = require("dayjs");

class TeacherController {
  // 获取教师列表
  async createTeacher(ctx, next) {
    try {
      const res = await addTeacher(ctx.request.body);

      if (res && res.affectedRows > 0) {
        commonResult(ctx, {
          status: 200,
          message: "新建成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `新建教师失败：${err}`);
    }
  }

  // 获取教师列表
  async getTeacherList(ctx, next) {
    try {
      const res = await queryTeacher(ctx.request.body);

      commonResult(ctx, {
        status: 200,
        data: res,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `获取学员列表失败：${err}`);
    }
  }

  // 编辑教师
  async editTeacher(ctx, next) {
    try {
      const res = await edit(ctx.request.body);

      if (res && res.affectedRows > 0) {
        commonResult(ctx, {
          status: 200,
          message: "编辑成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `编辑教师失败：${err}`);
    }
  }

  // 删除教师
  async deleteTeacher(ctx, next) {
    try {
      const res = await removeTeacher(ctx.request.body);

      if (res.length > 0) {
        commonResult(ctx, {
          status: 200,
          message: "删除成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `删除教师失败：${err}`);
    }
  }

  // 导出教师表
  async exportTeacher(ctx, next) {
    try {
      const res = await exportTea(ctx.request.body);

      if (Array.isArray(res)) {
        const name = `教师表`;
        const titleArr = [
          "教师姓名",
          "年龄",
          "性别",
          "手机号",
          "身份证号",
          "生日",
          "入职时间",
        ];
        const dataArr = res.map(
          ({ teaName, phoneNumber, sex, idCard, birthDate, createTs, age }) => [
            teaName,
            age,
            GENDER[sex],
            phoneNumber,
            idCard,
            dayjs(birthDate).format("YYYY-MM-DD"),
            dayjs(createTs).format("YYYY-MM-DD"),
          ]
        );

        exportExcel({
          ctx,
          name,
          titleArr,
          dataArr,
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `导出教师表失败：${err}`);
    }
  }

  // 按照任职课程查询教师
  async queryTeacherWithCourse(ctx, next) {
    try {
      const res = await searchTeacherWithCourse(ctx.request.body);

      commonResult(ctx, res);
    } catch (err) {
      commonServerWrongResult(ctx, `获取教师失败：${err}`);
    }
  }
}

module.exports = new TeacherController();
