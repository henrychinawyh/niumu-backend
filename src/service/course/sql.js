const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
  handleOrder,
} = require("../../utils/database");

// 查询课程是否已新建
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
        ...gradeItem,
      })
      .insert(),
  );
};

// 获取课程列表SQL
const queryCourseListSql = (data) => {
  const { current = 1, pageSize = 10 } = data;

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
    .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
    .select();
};

// 获取课程列表总数SQL
const queryCourseListTotalSql = (data) => {
  return sql
    .table(TABLENAME.COURSE)
    .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
    .count("*", "total")
    .select();
};

// 查询所有课程SQL
const getAllCoursesSql = () => {
  return sql
    .table(TABLENAME.COURSE)
    .field(convertListToSelectOption(["id", "name"]))
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
    .field(convertListToSelectOption(["id", "name"]))
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

// 查询是否有重名的级别名称SQL
const hasGradeInCourse = (data) => {
  return sql
    .table(TABLENAME.COURSEGRADE)
    .field(["name"])
    .where({
      ...toUnderlineData(data),
      status: 1,
    })
    .select();
};

// 更新课程下的级别名称SQL
const updateGradeInCourseSql = (data) => {
  const { name, courseId } = data || {};
  return sql
    .table(TABLENAME.COURSEGRADE)
    .data({ name })
    .where({ id: courseId, status: 1 })
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
      ]),
    )
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
  hasGradeInCourse,
  updateGradeInCourseSql,
  getAllSubjectsSql,
};
