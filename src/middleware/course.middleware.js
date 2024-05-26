const { exec } = require("mysqls");
const {
  commonServerWrongResult,
  commonResult,
} = require("../controlller/common");
const {
  queryGradeNameUnderCourseSql,
  queryGradeNamesUnderCourseSql,
} = require("../service/course/sql");

// 检查同课程下是否已经存在同名的级别（单个）
const hasGradeNameUnderCourse = async (ctx, next) => {
  try {
    const data = ctx.request.body;
    const res = await exec(queryGradeNameUnderCourseSql(data));

    if (
      res.length > 0 &&
      res?.[0]?.id !== data?.id &&
      res?.[0]?.name === data?.name
    ) {
      commonResult(ctx, {
        message: "同课程下的级别名称已存在，请重新输入级别名称",
        status: 500,
      });
      return;
    }

    await next();
  } catch (err) {
    commonServerWrongResult(
      ctx,
      `检查同课程下是否已经存在同名的级别失败：${err}`,
    );
  }
};

// 检查同课程下是否已经存在同名的级别（集合）
const hasGradeNamesUnderCourse = async (ctx, next) => {
  try {
    const data = ctx.request.body;

    const res = await exec(queryGradeNamesUnderCourseSql(data));

    if (res?.length) {
      commonResult(ctx, {
        message: `同课程下，级别名称 ${res?.map((item) => item.name)?.join(",")} 已存在，请重新输入`,
        status: 500,
      });
      return;
    }

    await next();
  } catch (err) {
    commonServerWrongResult(
      ctx,
      `检查同课程下是否已经存在同名的级别失败：${err}`,
    );
  }
};

module.exports = {
  hasGradeNameUnderCourse,
  hasGradeNamesUnderCourse,
};
