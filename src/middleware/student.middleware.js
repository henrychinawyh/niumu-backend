const {
  commonResult,
  commonServerWrongResult,
} = require("../controlller/common");
const { exec } = require("../db/seq");
const { queryStudentByIdCardSql } = require("../service/student/sql");

/**
 * @name  查询学员是否已存在
 */
const checkSameStu = async (ctx, next) => {
  const data = ctx.request.body;

  try {
    const res = await exec(queryStudentByIdCardSql(data));

    if (res?.length > 0) {
      commonResult(ctx, {
        status: 500,
        message: `学员${data?.stuName}已存在`,
      });

      return;
    }

    await next();
  } catch (err) {
    commonServerWrongResult(ctx, `查询学员失败：${err}`);
  }
};

module.exports = { checkSameStu };
