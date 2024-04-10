const {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
  exportStu,
  edit,
} = require("../../service/student");
const { GENDER } = require("../../utils/constant");
const { commonResult, commonServerWrongResult } = require("../common");
const dayjs = require("dayjs");
const xlsx = require("node-xlsx");

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

  // 导出学生表
  async exportStudent(ctx, next) {
    try {
      const res = await exportStu(ctx.request.body);

      if (Array.isArray(res) && res.length > 0) {
        const name = `学员表${dayjs().format("YYYY-MM-DD")}`;

        let xlsxObj = [
          {
            name,
            data: [],
          },
        ];

        res.forEach((item, idx) => {
          if (idx === 0) {
            // 插入第一行title
            xlsxObj[0].data.push([
              "学员姓名",
              "手机号",
              "性别",
              "身份证号",
              "生日",
              "入学时间",
            ]);
          }

          //  插入数据
          const { stuName, phoneNumber, sex, idCard, birthDate, createTs } =
            res[idx] || {};
          xlsxObj[0].data.push([
            stuName,
            phoneNumber,
            GENDER[sex],
            idCard,
            dayjs(birthDate).format("YYYY-MM-DD"),
            dayjs(createTs).format("YYYY-MM-DD"),
          ]);
        });

        let options = {
          sheetOptions: {
            "!cols": [
              { wch: 24 },
              { wch: 24 },
              { wch: 24 },
              { wch: 24 },
              { wch: 40 },
              { wch: 40 },
            ],
          },
        };

        const buffer = xlsx.build(xlsxObj, options);

        ctx.set(
          "Content-disposition",
          `attachment; filename=${encodeURIComponent(name)}.xlsx`
        );
        ctx.set(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        ctx.set("Access-Control-Expose-Headers", "Content-Disposition");

        ctx.body = buffer;
      }
    } catch (err) {
      console.log(err);
      commonServerWrongResult(ctx, `导出学生表失败：${err}`);
    }
  }
}

module.exports = new StudentController();
