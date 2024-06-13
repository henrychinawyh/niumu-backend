const { exec } = require("mysqls");
const {
  commonServerWrongResult,
  commonResult,
} = require("../controlller/common");
const {
  queryGradeNameUnderCourseSql,
  queryGradeNamesUnderCourseSql,
  hasCourseSql,
} = require("../service/course/sql");
const { SEMESTER } = require("../utils/constant");

// 检查是否有同名课程
const hasCourse = async (ctx, next) => {
  const data = ctx.request.body;
  try {
    const res = await exec(hasCourseSql(data));

    if (res.length > 0) {
      commonResult(ctx, {
        message: "该课程已存在，请重新输入课程名称",
        status: 500,
      });
      return;
    }
    await next();
  } catch (err) {
    commonServerWrongResult(ctx, `检查是否有同名课程失败：${err}`);
  }
};

// 检查同课程下是否已经存在同名的级别（单个）
const hasGradeNameUnderCourse = async (ctx, next) => {
  try {
    const data = ctx.request.body;
    const res = await exec(queryGradeNameUnderCourseSql(data));

    console.log(queryGradeNameUnderCourseSql(data), res);

    if (res.length > 0) {
      commonResult(ctx, {
        message: `同课程下的 ${SEMESTER[res[0]["course_semester"]]}${res[0].name} 已存在，请重新输入级别名称`,
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

// 检查同课程下是否已经存在同学期同名的级别（集合）
const hasGradeNamesUnderCourse = async (ctx, next) => {
  try {
    const data = ctx.request.body;

    const res = await exec(queryGradeNamesUnderCourseSql(data));

    if (res?.length) {
      commonResult(ctx, {
        message: `同课程下， ${res?.map((item) => `${SEMESTER[item.courseSemester]}${item.name}`)?.join(",")} 已存在，请重新输入`,
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
  hasCourse,
};
