const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  compareArrayWithMin,
  getQueryData,
  convertIfNull,
  convertJoinWhere,
  toUnderline,
  handleGroupBy,
} = require("../../utils/database");

/**
 * @name 查询是否有班级
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} name 班级名称
 */
const hasClassSql = (data) => {
  const { courseId, gradeId, name } = data;
  return sql
    .table(TABLENAME.CLASS)
    .where(toUnderlineData({ courseId, gradeId, name }))
    .select();
};

/**
 * @name 添加班级
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} name 班级名称
 */
const addClassSql = (data) => {
  const { courseId, gradeId, name } = data;
  // 新增班级-关联某个课程下的级别
  return sql
    .table(TABLENAME.CLASS)
    .data({
      [toUnderline("gradeId")]: gradeId,
      [toUnderline("courseId")]: courseId,
      name,
    })
    .insert();
};

/**
 * @name 班级新建好后，将老师关联到班级上
 */
const addTeacherForClassSql = (data) => {
  const { teacherId, classId } = data;

  return sql
    .table(TABLENAME.TEACHERCLASS)
    .data({
      [toUnderline("teacherId")]: teacherId,
      [toUnderline("classId")]: classId,
    })
    .insert();
};

/**
 * @name 班级新建好后，将学生关联到班级上
 */
const addStudentsForClassSql = (data) => {
  const { studentIds, classId } = data;

  return Array.isArray(studentIds)
    ? studentIds.map((studentId) =>
        sql
          .table(TABLENAME.STUDENTCLASS)
          .data({
            [toUnderline("studentId")]: studentId,
            [toUnderline("classId")]: classId,
          })
          .insert()
      )
    : [];
};

/**
 * @name 根据班级id查询班级信息
 */
const queryClassByIdSql = (data) => {
  const { gradeId, name } = data;

  return sql
    .table(TABLENAME.CLASS)
    .field(["id"])
    .where({ name, [toUnderline("gradeId")]: gradeId })
    .select();
};

/**
 * @name 查询班级
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} classId 班级id
 * @params {Number} teaName 教师名称
 */
const queryClassSql = (data) => {
  const { current, pageSize } = data || {};

  return sql
    .table(TABLENAME.CLASS)
    .field([
      `${TABLENAME.CLASS}.id AS classId`,
      `${TABLENAME.CLASS}.name AS className`,
      `${TABLENAME.COURSE}.name AS courseName`,
      `${TABLENAME.COURSE}.id AS courseId`,
      `${TABLENAME.COURSEGRADE}.id AS gradeId`,
      `${TABLENAME.COURSEGRADE}.name AS gradeName`,
      `${TABLENAME.TEACHER}.id AS teacherId`,
      `${TABLENAME.TEACHER}.tea_name AS teacherName`,
      `${convertIfNull("createTs", "", TABLENAME.CLASS)}`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.COURSE,
        where: {
          [`${TABLENAME.CLASS}.course_id`]: [`${TABLENAME.COURSE}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.COURSEGRADE,
        where: {
          [`${TABLENAME.CLASS}.grade_id`]: [`${TABLENAME.COURSEGRADE}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.TEACHERCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.TEACHERCLASS}.class_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.TEACHER,
        where: {
          [`${TABLENAME.TEACHERCLASS}.teacher_id`]: [`${TABLENAME.TEACHER}.id`],
        },
      },
    ])
    .page(current, pageSize)
    .where({
      ...toUnderlineData(
        convertJoinWhere(getQueryData({ ...data, status: 1 }), {
          status: TABLENAME.CLASS,
          createTs: TABLENAME.CLASS,
          courseId: `${TABLENAME.COURSE}.id`,
          classId: `${TABLENAME.CLASS}.id`,
          gradeId: `${TABLENAME.COURSEGRADE}.id`,
          name: TABLENAME.CLASS,
          teaName: TABLENAME.TEACHER,
        })
      ),
    })
    .select();
};

/**
 * @name 查询班级总数
 */
const queryClassTotalSql = (data) => {
  return sql
    .table(TABLENAME.CLASS)
    .field([`count(*) AS total`])
    .join([
      {
        dir: "left",
        table: TABLENAME.COURSE,
        where: {
          [`${TABLENAME.CLASS}.course_id`]: [`${TABLENAME.COURSE}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.COURSEGRADE,
        where: {
          [`${TABLENAME.CLASS}.grade_id`]: [`${TABLENAME.COURSEGRADE}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.TEACHERCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.TEACHERCLASS}.class_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.TEACHER,
        where: {
          [`${TABLENAME.TEACHERCLASS}.teacher_id`]: [`${TABLENAME.TEACHER}.id`],
        },
      },
    ])
    .where({
      ...toUnderlineData(
        convertJoinWhere(getQueryData({ ...data, status: 1 }), {
          status: TABLENAME.CLASS,
          createTs: TABLENAME.CLASS,
          courseId: `${TABLENAME.COURSE}.id`,
          classId: `${TABLENAME.CLASS}.id`,
          gradeId: `${TABLENAME.COURSEGRADE}.id`,
          name: TABLENAME.CLASS,
          teaName: TABLENAME.TEACHER,
        })
      ),
    })
    .select();
};

/**
 * @name 查询每个班级的人数
 */
const queryStudentTotalOfEachClassSql = (list) => {
  return sql
    .table(TABLENAME.STUDENTCLASS)
    .field(["count(*) AS total"])
    .where({
      [toUnderline("classId")]: {
        in: list?.map((item) => item.classId).join(","),
      },
      status: 1,
    })
    .group(handleGroupBy(["classId"]))
    .select();
};

module.exports = {
  hasClassSql,
  addClassSql,
  queryClassSql,
  queryClassTotalSql,
  queryStudentTotalOfEachClassSql,
  queryClassByIdSql,
  addTeacherForClassSql,
  addStudentsForClassSql,
};
