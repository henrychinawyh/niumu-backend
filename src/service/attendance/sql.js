const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { toUnderline } = require("../../utils/database");

/**
 * @name 查询考勤列表
 * @param classId 班级id
 * @param current 当前页
 * @param pageSize 每页条数
 */
const queryAttendanceListSql = (data) => {
  const { classId, current, pageSize } = data;

  return sql
    .table(TABLENAME.STUDENTCLASS)
    .field([
      `${TABLENAME.STUDENTCLASS}.id AS id`,
      `${TABLENAME.STUDENTCLASS}.class_id AS classId`,
      `${TABLENAME.STUDENTCLASS}.status AS status`,
      `${TABLENAME.STUDENT}.id AS studentId`,
      `${TABLENAME.STUDENT}.stu_name AS studentName`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.id AS payId`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.paid_course_count AS paidCourseCount`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_cost AS remainCost`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_course_count AS remainCourseCount`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.real_price AS realPrice`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.origin_price AS originPrice`,
      `${TABLENAME.FAMILY}.is_member AS isMember`,
      `${TABLENAME.FAMILY}.discount AS discount`,
      `${TABLENAME.FAMILY}.account_balance AS accountBalance`,
      `${TABLENAME.FAMILY}.id AS familyId`,
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
    .page(current, pageSize)
    .where({
      [`${TABLENAME.STUDENTCLASS}.class_id`]: classId,
      // [`${TABLENAME.STUDENTPAYCLASSRECORD}.status`]: 1,
    })
    .select();
};

/**
 * @name 查询考勤列表总数
 * @param classId 班级id
 */
const queryAttendanceListTotalSql = (data) => {
  const { classId } = data;

  return sql
    .table(TABLENAME.STUDENT)
    .field([`count(*) AS total`])
    .join([
      {
        dir: "right",
        table: TABLENAME.STUDENTCLASS,
        where: {
          [`${TABLENAME.STUDENTCLASS}.student_id`]: [`${TABLENAME.STUDENT}.id`],
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
      [`${TABLENAME.STUDENTCLASS}.class_id`]: classId,
      [`${TABLENAME.STUDENTPAYCLASSRECORD}.status`]: 1,
      [`${TABLENAME.STUDENT}.status`]: 1,
      [`${TABLENAME.STUDENTCLASS}.status`]: 1,
    })
    .select();
};

/**
 * @name 创建一条考勤记录
 * @param studentClassId 班级-学生id
 * @param studentId 学生id
 * @param classId 班级id
 * @param attendDate 考勤日期
 */
const createAttendanceRecordSql = (data) => {
  const { studentClassId, studentId, classId, attendDate } = data || {};

  return sql
    .table(TABLENAME.STUDENTATTENDCOURSERECORD)
    .data({
      [`${toUnderline("studentClassId")}`]: studentClassId,
      [`${toUnderline("studentId")}`]: studentId,
      [`${toUnderline("classId")}`]: classId,
      [`${toUnderline("attendDate")}`]: attendDate,
    })
    .insert();
};

/**
 * @name 更新课销记录
 * @param payId 购买课时记录id
 */
const updatePayClassRecordSql = (data) => {
  const { payId } = data || {};

  return `
      UPDATE
        student_pay_class_record
      SET
        remain_course_count = remain_course_count -1,
        remain_cost = remain_cost -real_price
      WHERE
        id = ${payId}
        AND status = 1
        AND remain_course_count > 0
        AND remain_cost > 0
        `;
};

const queryAttendanceRecordSql = (data) => {
  const { id, costTimeStart, costTimeEnd, classId } = data;

  return sql
    .table(TABLENAME.STUDENTATTENDCOURSERECORD)
    .field(["attend_date as attendDate"])
    .where({
      status: 1,
      [`${toUnderline("studentClassId")}`]: id,
      [`${toUnderline("attendDate")}`]: {
        between: [`'${costTimeStart}'`, `'${costTimeEnd}'`].join(","),
      },
      class_id: classId,
    })
    .select();
};

module.exports = {
  queryAttendanceListSql,
  queryAttendanceListTotalSql,
  createAttendanceRecordSql,
  updatePayClassRecordSql,
  queryAttendanceRecordSql,
};
