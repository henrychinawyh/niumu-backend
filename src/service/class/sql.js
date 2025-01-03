const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  convertIfNull,
  toUnderline,
  handleGroupBy,
} = require("../../utils/database");

/**
 * @name 查询当前的课程级别下是否有一个同名的班级名称SQL
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} name 班级名称
 */
const hasClassByNameSql = (data) => {
  const { courseId, gradeId, name } = data;
  return sql
    .table(TABLENAME.CLASS)
    .where(toUnderlineData({ courseId, gradeId, name }))
    .select();
};

/**
 * @name 根据班级id查询是否存在班级
 */
const hasClassByIdSql = (data) => {
  const { id } = data;

  return sql
    .table(TABLENAME.CLASS)
    .where({
      id,
    })
    .select();
};

/**
 * @name 添加班级
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} name 班级名称
 */
const addClassSql = (data) => {
  const { courseId, gradeId, name, courseSemester } = data;
  // 新增班级-关联某个课程下的级别
  return sql
    .table(TABLENAME.CLASS)
    .data({
      [toUnderline("gradeId")]: gradeId,
      [toUnderline("courseId")]: courseId,
      [toUnderline("courseSemester")]: courseSemester,
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
          .insert(),
      )
    : [];
};

/**
 * @name 将学生与当前班级的关系解绑(从班级中删除多个学生)
 */
const removeStudentForClassSql = (data) => {
  const { classId, list } = data;

  return sql
    .table(TABLENAME.STUDENTCLASS)
    .data({
      status: 99,
    })
    .where({
      [toUnderline("classId")]: classId,
      [toUnderline("studentId")]: {
        in: list?.join(","),
      },
      status: 1,
    })
    .update();
};

/**
 * @name 删除班级下的单个学生SQL
 */
const delStudentSql = (data) => {
  const { id } = data;
  return sql
    .table(TABLENAME.STUDENTCLASS)
    .data({
      status: 99,
    })
    .where({
      id,
      status: 1,
    })
    .update();
};

/**
 * @name 删除单个学生考勤SQL
 */
const delStudentInAttendanceSql = (data) => {
  const { id } = data;

  return sql
    .table(TABLENAME.STUDENTPAYCLASSRECORD)
    .data({ status: 99 })
    .where({
      student_class_id: id,
      status: 1,
    })
    .update();
};

/**
 * @name 查询班级列表
 * @params {Number} courseId 课程id
 * @params {Number} gradeId 级别id
 * @params {Number} classId 班级id
 * @params {Number} teaName 教师名称
 */
const queryClassSql = (data) => {
  const {
    current,
    pageSize,
    courseId,
    gradeId,
    classId,
    teacherName,
    courseSemester,
  } = data || {};

  const whereParams = {
    [`${TABLENAME.CLASS}.status`]: 1,
  };

  // 判断条件
  if (courseId) {
    whereParams[`${TABLENAME.COURSE}.id`] = courseId;
  }
  if (gradeId) {
    whereParams[`${TABLENAME.COURSEGRADE}.id`] = gradeId;
  }
  if (classId) {
    whereParams[`${TABLENAME.CLASS}.id`] = classId;
  }
  if (teacherName) {
    whereParams[`${TABLENAME.TEACHER}.tea_name`] = teacherName;
  }
  if (courseSemester) {
    whereParams[`${TABLENAME.COURSEGRADE}.course_semester`] = courseSemester;
  }

  return sql
    .table(TABLENAME.CLASS)
    .field([
      `${TABLENAME.CLASS}.id AS classId`,
      `${TABLENAME.CLASS}.name AS className`,
      `${TABLENAME.COURSE}.name AS courseName`,
      `${TABLENAME.COURSE}.id AS courseId`,
      `${TABLENAME.COURSEGRADE}.id AS gradeId`,
      `${TABLENAME.COURSEGRADE}.name AS gradeName`,
      `${TABLENAME.COURSEGRADE}.course_semester AS courseSemester`,
      `${TABLENAME.COURSEGRADE}.course_origin_price AS courseOriginPrice`,
      `${TABLENAME.COURSEGRADE}.each_course_price AS eachCoursePrice`,
      `${TABLENAME.COURSEGRADE}.course_count AS courseCount`,
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
    .where(whereParams)
    .select();
};

/**
 * @name 查询班级列表总数
 */
const queryClassTotalSql = (data) => {
  const { courseId, gradeId, classId, teacherName } = data;

  const whereParams = {
    [`${TABLENAME.CLASS}.status`]: 1,
  };

  // 判断条件
  if (courseId) {
    whereParams[`${TABLENAME.COURSE}.id`] = courseId;
  }
  if (gradeId) {
    whereParams[`${TABLENAME.COURSEGRADE}.id`] = gradeId;
  }
  if (classId) {
    whereParams[`${TABLENAME.CLASS}.id`] = classId;
  }
  if (teacherName) {
    whereParams[`${TABLENAME.TEACHER}.tea_name`] = teacherName;
  }

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
    .where(whereParams)
    .select();
};

/**
 * @name 查询班级中的学员
 * @param {Number} list 班级id-list
 */
const queryStudentOfEachClassSql = (data) => {
  const { list } = data;

  return sql
    .table(TABLENAME.STUDENTCLASS)
    .field([
      `${TABLENAME.STUDENTCLASS}.id AS id`,
      `${TABLENAME.STUDENT}.id AS studentId`,
      `${TABLENAME.STUDENT}.stu_name AS name`,
      `${TABLENAME.STUDENT}.birth_date AS birthDate`,
      `${TABLENAME.STUDENT}.sex AS sex`,
      `${TABLENAME.STUDENTCLASS}.class_id AS classId`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_course_count AS remainCourseCount`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.id AS payId`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.payment AS payment`,
      `${TABLENAME.FAMILY}.is_member AS isMember`,
      `${TABLENAME.FAMILY}.discount AS discount`,
      `${TABLENAME.FAMILY}.account_balance AS accountBalance`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.STUDENTCLASS}.student_id`]: [`${TABLENAME.STUDENT}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.FAMILYMEMBER,
        where: {
          [`${TABLENAME.STUDENT}.id`]: [`${TABLENAME.FAMILYMEMBER}.student_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.FAMILY,
        where: {
          [`${TABLENAME.FAMILYMEMBER}.family_id`]: [`${TABLENAME.FAMILY}.id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENTPAYCLASSRECORD,
        where: {
          [`${TABLENAME.STUDENTCLASS}.id`]: [
            `${TABLENAME.STUDENTPAYCLASSRECORD}.student_class_id`,
          ],
          [`${TABLENAME.STUDENTCLASS}.student_id`]: [
            `${TABLENAME.STUDENTPAYCLASSRECORD}.student_id`,
          ],
        },
      },
    ])
    .where({
      [`${TABLENAME.STUDENTCLASS}.class_id`]: {
        in: list?.join(","),
      },
      [`${TABLENAME.STUDENTCLASS}.status`]: 1,
      [`${TABLENAME.STUDENTPAYCLASSRECORD}.status`]: 1,
    })
    .select();
};

/**
 * @name 查询每个班级的学员总数
 */
const queryStudentTotalOfEachClassSql = (list) => {
  return sql
    .table(TABLENAME.STUDENTCLASS)
    .field(["count(*) AS total", "class_id AS classId"])
    .where({
      [toUnderline("classId")]: {
        in: list?.map((item) => item.classId).join(","),
      },
      status: 1,
    })
    .group(handleGroupBy(["classId"]))
    .select();
};

/**
 * @name 编辑班级名称SQL
 * @param {Number} classId 班级id
 * @param {String} name 班级名称
 */
const editClassNameSql = (data) => {
  const { classId, name } = data;

  return sql
    .table(TABLENAME.CLASS)
    .data({
      name,
    })
    .where({
      id: classId,
    })
    .update();
};

/**
 * @name 修改班级的任课教师SQL
 * @param {Number} classId 班级id
 * @param {Number} teacherId 教师id
 */
const editTeacherForClassSql = (data) => {
  const { classId, teacherId } = data;

  return sql
    .table(TABLENAME.TEACHERCLASS)
    .data({
      [toUnderline("teacherId")]: teacherId,
    })
    .where({
      [toUnderline("classId")]: classId,
    })
    .update();
};

/**
 * @name 查询添加的学员是否已在同课程级别下已存在SQL
 * @param {Number} studentIds 学员id-list
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} classId 班级id
 */
const hasStudentsInSameCourseGradeSql = (data) => {
  const { studentIds, courseId, gradeId, classId } = data;

  const whereParams = Object.assign(
    {},
    {
      [`${TABLENAME.CLASS}.course_id`]: courseId,
      [`${TABLENAME.CLASS}.grade_id`]: gradeId,
      [`${TABLENAME.STUDENTCLASS}.status`]: 1,
      [`${TABLENAME.STUDENTCLASS}.student_id`]: {
        in: studentIds?.join(","),
      },
    },
    classId
      ? {
          [`${TABLENAME.STUDENTCLASS}.class_id`]: {
            neq: classId,
          },
        }
      : {},
  );

  return sql
    .table(TABLENAME.CLASS)
    .field([
      `${TABLENAME.CLASS}.name AS className`,
      `${TABLENAME.STUDENT}.id AS studentId`,
      `${TABLENAME.STUDENT}.stu_name AS name`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENTCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.STUDENTCLASS}.class_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.STUDENTCLASS}.student_id`]: [`${TABLENAME.STUDENT}.id`],
        },
      },
    ])
    .where(whereParams)
    .select();
};

/**
 * @name 查询学员在班级中是否存在未销课时SQL
 * @param {Number} classId 班级id
 * @param {Number} studentId 学员id
 */
const queryRemianCourseCountSql = (data) => {
  const { id } = data;

  return sql
    .table(TABLENAME.STUDENTPAYCLASSRECORD)
    .field(["remain_course_count AS remianCourseCount"])
    .where({
      id,
      status: 1,
    })
    .select();
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
 * @name 删除班级
 */
const delClassSql = (data) => {
  const { id } = data;

  return sql
    .table(TABLENAME.CLASS)
    .data({
      status: 99,
    })
    .where({
      id,
      status: 1,
    })
    .update();
};

// 查询单个学员是否存在于某个班级中Sql
const hasStudentInClassSql = (data) => {
  return sql
    .table(TABLENAME.STUDENTCLASS)
    .where(toUnderlineData(data))
    .select();
};

// 查看班级详情
const queryClassDetailSql = (data) => {
  // 班级id
  const { id } = data;

  return sql
    .table(TABLENAME.CLASS)
    .field([
      `${TABLENAME.STUDENT}.id AS studentId`,
      `${TABLENAME.STUDENT}.stu_name AS stuName`,
      `${TABLENAME.STUDENT}.sex AS sex`,
      `${TABLENAME.STUDENT}.birth_date AS birthDate`,
      `${TABLENAME.CLASS}.id AS classId`,
      `${TABLENAME.STUDENTCLASS}.id AS id`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_course_count AS remainCourseCount`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_cost AS remainCost`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.payment AS payment`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.id AS payId`,
      `${TABLENAME.FAMILY}.account_balance AS accountBalance`,
      `${TABLENAME.FAMILY}.is_member AS isMember`,
      `${TABLENAME.FAMILY}.discount AS discount`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENTCLASS,
        where: {
          [`${TABLENAME.CLASS}.id`]: [`${TABLENAME.STUDENTCLASS}.class_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.STUDENT}.id`]: [`${TABLENAME.STUDENTCLASS}.student_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.FAMILYMEMBER,
        where: {
          [`${TABLENAME.STUDENT}.id`]: [`${TABLENAME.FAMILYMEMBER}.student_id`],
        },
      },
      {
        dir: "right",
        table: TABLENAME.FAMILY,
        where: {
          [`${TABLENAME.FAMILY}.id`]: [`${TABLENAME.FAMILYMEMBER}.family_id`],
        },
      },
      {
        dir: "left",
        table: TABLENAME.STUDENTPAYCLASSRECORD,
        where: {
          [`${TABLENAME.STUDENTCLASS}.id`]: [
            `${TABLENAME.STUDENTPAYCLASSRECORD}.student_class_id`,
          ],
        },
      },
    ])
    .where({
      [`${TABLENAME.STUDENTCLASS}.status`]: 1,
      [`${TABLENAME.CLASS}.id`]: id,
      [`${TABLENAME.FAMILY}.status`]: 1,
      [`${TABLENAME.FAMILYMEMBER}.status`]: 1,
    })
    .select();
};

// 为班级添加学员
const addStudentToClassSql = (data) => {
  const { studentIds, classId } = data || {};

  return studentIds?.map((item) =>
    sql
      .table(TABLENAME.STUDENTCLASS)
      .data({
        student_id: item,
        class_id: classId,
      })
      .insert(),
  );
};

module.exports = {
  hasClassByNameSql,
  queryClassDetailSql,
  hasClassByIdSql,
  addClassSql,
  queryClassSql,
  queryClassTotalSql,
  queryStudentTotalOfEachClassSql,
  queryClassByIdSql,
  addTeacherForClassSql,
  addStudentsForClassSql,
  queryStudentOfEachClassSql,
  removeStudentForClassSql,
  editClassNameSql,
  editTeacherForClassSql,
  hasStudentsInSameCourseGradeSql,
  queryRemianCourseCountSql,
  delStudentSql,
  delClassSql,
  delStudentInAttendanceSql,
  hasStudentInClassSql,
  addStudentToClassSql,
};
