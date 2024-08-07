const { exec } = require("mysqls");
const {
  hasClassByIdSql,
  hasClassByNameSql,
  hasStudentInClassSql,
} = require("../service/class/sql");
const { compareArrayWithMin } = require("../utils/database");
const { commonResult } = require("../controlller/common");

// 查询当前班级是否存在
const hasClass = async (ctx, next) => {
  const data = ctx.request.body;

  const { id } = data || {};

  if (!id) {
    commonResult(ctx, {
      message: "班级id不能为空",
      status: 500,
    });
    return;
  }

  const res = await exec(hasClassByIdSql(data));

  await next();

  return res;
};

// 根据课程-级别-班级名称查询班级是否已存在
const hasClassNameUnderCourseGrade = async (ctx, next) => {
  const data = ctx.request.body;

  const res = await exec(hasClassByNameSql(data));

  if (
    res?.length &&
    res?.[0]?.name === data?.name?.trim() &&
    res?.[0]?.id !== data?.classId &&
    res?.[0]?.["course_id"] === data?.courseId
  ) {
    commonResult(ctx, {
      message: "同课程下的班级名称已存在，请重新输入班级名称",
      status: 500,
    });
    return;
  }

  await next();
};

// 转班前查询转移的目标班级下是否已存在这个学员
const queryStudentInClassBeforeChangeClass = async (ctx, next) => {
  const data = ctx.request.body;

  const res = await exec(
    hasStudentInClassSql({
      classId: data?.classId,
      studentId: data?.studentId,
      status: 1,
    }),
  );

  if (compareArrayWithMin(res)) {
    commonResult(ctx, {
      message: `学员已存在目标班级中，请勿重复添加`,
      status: 500,
    });
    return;
  }

  await next();
};

module.exports = {
  hasClass,
  hasClassNameUnderCourseGrade,
  queryStudentInClassBeforeChangeClass,
};
