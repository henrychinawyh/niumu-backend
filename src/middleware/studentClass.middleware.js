const { unique } = require("radash");
const { hasStudentsInSameCourseGradeSql } = require("../service/class/sql");
const { compareArrayWithMin } = require("../utils/database");
const { exec } = require("../db/seq");
const { commonResult } = require("../controlller/common");

// 学员是否存在在同课程同级别下的班级
const hasStudentsInSameCourseGrade = async (ctx, next) => {
  const data = ctx.request.body;

  const hasStus = await exec(hasStudentsInSameCourseGradeSql(data));

  if (compareArrayWithMin(hasStus)) {
    commonResult(ctx, {
      message: `${unique(hasStus, (f) => f.name)
        .map((item) => `${item.name}`)
        .join("，")}已存在在同课程同级别下的班级，请勿重复添加`,
      status: 500,
    });

    return;
  }

  await next();
};

module.exports = {
  hasStudentsInSameCourseGrade,
};
