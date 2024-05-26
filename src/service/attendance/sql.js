const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");

const queryAttendanceListSql = (data) => {
  const { classId, current, pageSize } = data;

  return sql
    .table(TABLENAME.STUDENT)
    .field([
      `${TABLENAME.STUDENTCLASS}.id AS id`,
      `${TABLENAME.STUDENT}.id AS studentId`,
      `${TABLENAME.STUDENT}.stu_name AS studentName`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.paid_course_count AS paidCourseCount`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_cost AS remainCost`,
      `${TABLENAME.STUDENTPAYCLASSRECORD}.remain_course_count AS remainCourseCount`,
    ])
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
    .page(current, pageSize)
    .where({
      [`${TABLENAME.STUDENTCLASS}.class_id`]: classId,
      [`${TABLENAME.STUDENTPAYCLASSRECORD}.status`]: 1,
    })
    .select();
};

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
    })
    .select();
};

module.exports = {
  queryAttendanceListSql,
  queryAttendanceListTotalSql,
};
