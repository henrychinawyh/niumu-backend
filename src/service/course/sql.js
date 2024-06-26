const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
  handleOrder,
  toUnderline,
  handleGroupBy,
} = require("../../utils/database");
const { floor } = require("lodash");

// 根据课程名称查询课程
const hasCourseSql = (data) => {
  const { name } = data;
  return sql.table(TABLENAME.COURSE).where({ name, status: 1 }).select();
};

// 插入课程
const insertCourseSql = (data) => {
  const { name } = data;

  return sql
    .table(TABLENAME.COURSE)
    .data({
      name,
    })
    .insert();
};

// 查询课程id
const queryCourseId = (data) => {
  const { name } = data;
  return sql.table(TABLENAME.COURSE).where({ name, status: 1 }).select();
};

// 批量插入课程级别
const batchInsertCourseGradeSql = (data, id) => {
  const { grades } = data;

  return grades.map((gradeItem) =>
    sql
      .table(TABLENAME.COURSEGRADE)
      .data({
        course_id: id,
        ...toUnderlineData(gradeItem),
        each_course_price: floor(
          gradeItem["courseOriginPrice"] / gradeItem["courseCount"],
          2,
        ),
      })
      .insert(),
  );
};

// 获取课程列表SQL
const queryCourseListSql = (data) => {
  const { current = 1, pageSize = 10 } = data;

  const whereParams = Object.assign(
    {},
    { ...toUnderlineData(getQueryData(data)), status: 1 },
    data.name ? { name: { like: `%${data.name}%` } } : {},
  );

  return sql
    .table(TABLENAME.COURSE)
    .field([
      "id",
      "name",
      "status",
      'IFNULL(create_ts, "") AS createTs',
      'IFNULL(update_ts, "") AS updateTs',
    ])
    .page(current, pageSize)
    .where(whereParams)
    .select();
};

// 获取课程列表总数SQL
const queryCourseListTotalSql = (data) => {
  const whereParams = Object.assign(
    {},
    { ...toUnderlineData(getQueryData(data)), status: 1 },
    data.name ? { name: { like: `%${data.name}%` } } : {},
  );

  return sql
    .table(TABLENAME.COURSE)
    .where(whereParams)
    .count("*", "total")
    .select();
};

/**
 * @name 查询课程下所有的学员人数
 *
 */
const queryCourseStuTotalSql = (data) => {
  const { current = 1, pageSize = 10, name } = data;

  const whereParams = Object.assign(
    {},
    {
      [`${TABLENAME.COURSE}.status`]: 1,
      [`${TABLENAME.STUDENTCLASS}.id`]: { gt: 0 },
    },
    name
      ? {
          [`${TABLENAME.COURSE}.name`]: {
            like: `%${name}%`,
          },
        }
      : {},
  );

  return sql
    .table(TABLENAME.COURSE)
    .field(["count(*) AS total"])
    .join([
      {
        dir: "left",
        table: TABLENAME.CLASS,
        where: {
          [`${TABLENAME.COURSE}.id`]: [`${TABLENAME.CLASS}.course_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENTCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.STUDENTCLASS}.class_id`],
        },
      },
    ])
    .page(current, pageSize)
    .where(whereParams)
    .group(`${TABLENAME.COURSE}.id`)
    .select();
};

// 查询所有课程SQL
const getAllCoursesSql = () => {
  return sql
    .table(TABLENAME.COURSE)
    .field(convertListToSelectOption(["id", "name"]))
    .select();
};

/**
 * @name 查询某个课程的级别下所有的学员人数
 */
const queryGradeStuTotalSql = (data) => {
  const { courseId } = data;

  return sql
    .table(TABLENAME.COURSEGRADE)
    .field(["count(*) AS total", `${TABLENAME.COURSEGRADE}.id as gradeId`])
    .join([
      {
        dir: "left",
        table: TABLENAME.CLASS,
        where: {
          [`${TABLENAME.COURSEGRADE}.id`]: [`${TABLENAME.CLASS}.grade_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENTCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.STUDENTCLASS}.class_id`],
        },
      },
    ])
    .where({
      [`${TABLENAME.COURSEGRADE}.course_id`]: courseId,
      [`${TABLENAME.COURSEGRADE}.status`]: 1,
      [`${TABLENAME.STUDENTCLASS}.id`]: { gt: 0 },
    })
    .group(
      handleGroupBy([
        `${TABLENAME.COURSEGRADE}.id`,
        `${TABLENAME.COURSEGRADE}.course_id`,
      ]),
    )
    .select();
};

// 删除课程SQL
const removeCourseSql = (data) => {
  const { id } = data;
  return sql
    .table(TABLENAME.COURSE)
    .data({ status: 99 })
    .where({ id })
    .update();
};

// 删除课程下所有级别SQL
const removeCourseGradeSql = (data) => {
  const { id } = data;
  return sql
    .table(TABLENAME.COURSEGRADE)
    .data({ status: 99 })
    .where({
      course_id: id,
    })
    .update();
};

// 编辑课程SQL
const editSql = (data) => {
  const { id, ...rest } = data;
  return sql
    .table(TABLENAME.COURSE)
    .data(toUnderlineData(rest))
    .where({ id })
    .update();
};

// 获取课程下所有的级别SQL
const getGradeSql = (data) => {
  return sql
    .table(TABLENAME.COURSEGRADE)
    .field([
      ...convertListToSelectOption(["id", "name"]),
      "course_semester AS courseSemester",
      "course_count AS courseCount",
      "course_origin_price AS courseOriginPrice",
      "each_course_price AS eachCoursePrice",
    ])
    .where({
      ...toUnderlineData(data),
      status: 1,
    })
    .select();
};

// 删除课程的级别SQL
const delGradeSql = (data) => {
  return sql
    .table(TABLENAME.COURSEGRADE)
    .data({ status: 99 })
    .where(toUnderlineData(data))
    .update();
};

// 更新课程下的级别名称SQL
const updateGradeInCourseSql = (data) => {
  const { name, id } = data || {};
  return sql
    .table(TABLENAME.COURSEGRADE)
    .data({ name })
    .where({ id, status: 1 })
    .update();
};

// 获取课程-级别-班级信息SQL
const getAllSubjectsSql = () => {
  return sql
    .table(TABLENAME.COURSE)
    .field([
      `${TABLENAME.COURSE}.id AS courseId`,
      `${TABLENAME.COURSE}.name AS courseName`,
      `${TABLENAME.COURSEGRADE}.id AS gradeId`,
      `${TABLENAME.COURSEGRADE}.name AS gradeName`,
      `${TABLENAME.COURSEGRADE}.course_semester AS courseSemester`,
      `IFNULL(${TABLENAME.CLASS}.id, "") AS classId`,
      `IFNULL(${TABLENAME.CLASS}.name, "") AS className`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.COURSEGRADE,
        where: [
          {
            [`${TABLENAME.COURSEGRADE}.course_id`]: [`${TABLENAME.COURSE}.id`],
          },
        ],
      },
      {
        dir: "left",
        table: TABLENAME.CLASS,
        where: [
          {
            [`${TABLENAME.COURSE}.id`]: [`${TABLENAME.CLASS}.course_id`],
          },
          {
            [`${TABLENAME.COURSEGRADE}.id`]: [`${TABLENAME.CLASS}.grade_id`],
          },
        ],
      },
    ])
    .where({
      [`${TABLENAME.COURSE}.status`]: 1,
      [`${TABLENAME.COURSEGRADE}.status`]: 1,
    })
    .order(
      handleOrder([
        {
          column: `${TABLENAME.COURSE}.id`,
          sort: "ASC",
        },
        {
          column: `${TABLENAME.COURSEGRADE}.id`,
          sort: "ASC",
        },
        {
          column: `${TABLENAME.CLASS}.id`,
          sort: "ASC",
        },
      ]),
    )
    .select();
};

/**
 * @name 检查同课程下是否已经存在同名的级别
 */
const queryGradeNameUnderCourseSql = (data) => {
  const { courseId, name, courseSemester } = data;

  return sql
    .table(TABLENAME.COURSEGRADE)
    .where({
      [`${toUnderline("courseId")}`]: courseId,
      name,
      course_semester: courseSemester,
      status: 1,
    })
    .select();
};

/**
 * @name 检查同课程下是否已经存在同名的级别（集合）
 */
const queryGradeNamesUnderCourseSql = (data) => {
  const { courseId, grades } = data;

  return sql
    .table(TABLENAME.COURSEGRADE)
    .field([
      "name",
      "course_semester AS courseSemester",
      "id",
      "course_id AS courseId",
    ])
    .where({
      [`${toUnderline("courseId")}`]: courseId,
      [`${toUnderline("courseSemester")}`]: {
        in: grades?.map((item) => `"${item.courseSemester}"`).join(","),
      },
      name: {
        in: grades?.map((item) => `"${item.name}"`).join(","),
      },
      status: 1,
    })
    .select();
};

// 查询课程-季度-级别信息SQL
const queryCouresDetailSql = (data) => {
  const { courseId, courseSemester, gradeId } = data;

  const whereParams = {};

  if (courseId) {
    whereParams.courseId = courseId;
  }
  if (courseSemester) {
    whereParams.courseSemester = courseSemester;
  }
  if (gradeId) {
    whereParams[`${TABLENAME.COURSEGRADE}.id`] = gradeId;
  }

  return sql
    .table(TABLENAME.COURSEGRADE)
    .field([
      `${TABLENAME.COURSE}.id AS courseId`,
      `${TABLENAME.COURSE}.name AS courseName`,
      `${TABLENAME.COURSEGRADE}.id AS id`,
      `${TABLENAME.COURSEGRADE}.name AS gradeName`,
      `${TABLENAME.COURSEGRADE}.course_semester AS courseSemester`,
      `${TABLENAME.COURSEGRADE}.course_origin_price AS courseOriginPrice`,
      `${TABLENAME.COURSEGRADE}.each_course_price AS eachCoursePrice`,
      `${TABLENAME.COURSEGRADE}.course_count AS courseCount`,
    ])
    .join({
      dir: "left",
      table: TABLENAME.COURSE,
      where: [
        {
          [`${TABLENAME.COURSEGRADE}.course_id`]: [`${TABLENAME.COURSE}.id`],
        },
      ],
    })
    .where({
      ...toUnderlineData(whereParams),
      [`${TABLENAME.COURSE}.status`]: 1,
      [`${TABLENAME.COURSEGRADE}.status`]: 1,
    })
    .select();
};

module.exports = {
  hasCourseSql,
  insertCourseSql,
  queryCourseId,
  batchInsertCourseGradeSql,
  queryCourseListSql,
  queryCourseListTotalSql,
  getAllCoursesSql,
  removeCourseSql,
  removeCourseGradeSql,
  editSql,
  getGradeSql,
  delGradeSql,
  updateGradeInCourseSql,
  getAllSubjectsSql,
  queryGradeNameUnderCourseSql,
  queryGradeNamesUnderCourseSql,
  queryCourseStuTotalSql,
  queryGradeStuTotalSql,
  queryCouresDetailSql,
};
