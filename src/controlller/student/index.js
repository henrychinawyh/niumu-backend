const {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
  exportStu,
  edit,
  querySurplus,
} = require("../../service/student");
const { GENDER } = require("../../utils/constant");
const { exportExcel } = require("../../utils/export");
const { commonResult, commonServerWrongResult } = require("../common");
const dayjs = require("dayjs");

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
    try {
      const res = await edit(ctx.request.body);

      if (res && res.affectedRows > 0) {
        commonResult(ctx, {
          status: 200,
          message: "编辑成功",
        });
      }
    } catch (err) {
      commonServerWrongResult(ctx, `编辑学员失败：${err}`);
    }
  }

  // 删除学员
  async deleteStudent(ctx, next) {
    try {
      await removeStudent(ctx.request.body);

      commonResult(ctx, {
        status: 200,
        message: "删除成功",
      });
    } catch (err) {
      commonServerWrongResult(ctx, `删除学员失败：${err}`);
    }
  }

  // 导出学生表
  async exportStudent(ctx, next) {
    try {
      const res = await exportStu(ctx.request.body);

      if (Array.isArray(res)) {
        const name = `学员表`;
        const titleArr = [
          "学员姓名",
          "年龄",
          "性别",
          "手机号",
          "身份证号",
          "生日",
        ];
        const dataArr = res.map(
          ({ stuName, phoneNumber, sex, idCard, birthDate, createTs, age }) => [
            stuName,
            age,
            GENDER[sex],
            phoneNumber,
            idCard,
            dayjs(birthDate).format("YYYY-MM-DD"),
          ],
        );

        exportExcel({
          ctx,
          name,
          titleArr,
          dataArr,
        });
      }
    } catch (err) {
      console.log(err);
      commonServerWrongResult(ctx, `导出学生表失败：${err}`);
    }
  }

  // 查询剩余课销
  async getSurplus(ctx, next) {
    try {
      const res = await querySurplus(ctx.request.body);
      commonResult(ctx, {
        status: 200,
        data: res,
      });
    } catch (err) {
      commonServerWrongResult(ctx, `查询剩余课销失败：${err}`);
    }
  }
}

module.exports = new StudentController();
