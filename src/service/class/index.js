const { where } = require("sequelize");
const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  getQueryData,
  toUnderline,
  compareArrayWithMin,
  convertIfNull,
  convertJoinWhere,
  toUnderlineData,
} = require("../../utils/database");

/**
 * @name 新增班级
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} teacherId 教师id
 * @param {String} name 班级名称
 * @param {Array<Number>} studentIds 学生集合
 *
 * @returns void
 */
const addClass = async (data) => {
  const { courseId, gradeId, name, teacherId, studentIds, ...rest } =
    data || {};

  try {
    const addClassRes = await transaction([
      // 新增班级-关联某个课程下的级别
      sql
        .table(TABLENAME.CLASS)
        .data({
          [toUnderline("gradeId")]: gradeId,
          [toUnderline("courseId")]: courseId,
          name,
        })
        .insert(),
      // 查询该班级的班级id
      sql
        .table(TABLENAME.CLASS)
        .field(["id"])
        .where({ name, [toUnderline("gradeId")]: gradeId })
        .select(),
    ]);

    const [addRes, searchRes] = addClassRes || [];

    if (compareArrayWithMin(searchRes, ">", 0)) {
      // 查找到了班级
      const classId = searchRes[0].id;

      await transaction(
        [
          // 关联班级中的老师
          sql
            .table(TABLENAME.TEACHERCLASS)
            .data({
              [toUnderline("teacherId")]: teacherId,
              [toUnderline("classId")]: classId,
            })
            .insert(),
        ].concat(
          // 关联班级中的学生
          Array.isArray(studentIds)
            ? studentIds.map((studentId) =>
                sql
                  .table(TABLENAME.STUDENTCLASS)
                  .data({
                    [toUnderline("studentId")]: studentId,
                    [toUnderline("classId")]: classId,
                  })
                  .insert()
              )
            : []
        )
      );

      return {
        message: "新增成功",
      };
    }
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

/**
 * @name 查询班级信息
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} classId 班级id
 * @param {Number} current 当前页码
 * @param {Number} pageSize 每页条数
 * @param {String} name 教师名称
 *
 * @return 课程名称,课程id,级别名称,级别id,班级名称,班级id,教师名称,教师id,当前班级的学员总数,创建时间
 */
const getClass = async (data) => {
  const { current, pageSize } = data || {};

  try {
    // 查询班级
    const res = await transaction([
      sql
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
              [`${TABLENAME.TEACHERCLASS}.teacher_id`]: [
                `${TABLENAME.TEACHER}.id`,
              ],
            },
          },
        ])
        .page(current, pageSize)
        .where({
          ...convertJoinWhere(
            toUnderlineData(getQueryData({ ...data, status: 1 })),
            {
              status: TABLENAME.CLASS,
              createTs: TABLENAME.CLASS,
              courseId: TABLENAME.COURSE,
              classId: TABLENAME.CLASS,
              gradeId: TABLENAME.COURSEGRADE,
              name: TABLENAME.CLASS,
              teaName: TABLENAME.TEACHER,
            }
          ),
        })
        .select(),
    ]);

    return {
      message: "查询成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

module.exports = {
  addClass,
  getClass,
};
