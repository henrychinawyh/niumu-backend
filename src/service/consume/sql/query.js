const { sql } = require("../../../db/seq");
const { TABLENAME } = require("../../../utils/constant");

// 查询家庭账户余额SQL
const queryAccountBalanceSql = (data) => {
  const { familyId } = data || {};

  return sql
    .table(TABLENAME.FAMILY)
    .field([
      "account_balance as accountBalance",
      "id as familyId",
      "family_name as familyName",
    ])
    .where({
      id: familyId,
      status: 1,
    })
    .select();
};

// 查询多个家庭的账户余额
const queryAccountBalancesSql = (data) => {
  const { familyIds } = data || {};

  return sql
    .table(TABLENAME.FAMILY)
    .field([
      "account_balance as accountBalance",
      "id as familyId",
      "family_name as familyName",
    ])
    .where({
      id: { in: familyIds.join(",") },
      status: 1,
    })
    .select();
};

// 查看学员消费记录SQL
const getStudentConsumeRecordSql = (data) => {
  const { studentId, current, pageSize } = data || {};
  return sql
    .table(TABLENAME.FAMILYCOSTRECORD)
    .field([
      `${TABLENAME.FAMILYCOSTRECORD}.id as id`,
      `${TABLENAME.FAMILYCOSTRECORD}.student_id as studentId`,
      `${TABLENAME.STUDENT}.stu_name as stuName`,
      `${TABLENAME.FAMILYCOSTRECORD}.cost as cost`,
      `${TABLENAME.FAMILYCOSTRECORD}.origin_price as originPrice`,
      `${TABLENAME.FAMILYCOSTRECORD}.create_ts as createTime`,
      `${TABLENAME.FAMILYCOSTRECORD}.consume_detail as consumeDetail`,
      `${TABLENAME.FAMILYCOSTRECORD}.discount as discount`,
      `${TABLENAME.FAMILYCOSTRECORD}.consume_num as consumeNum`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: [
            `${TABLENAME.STUDENT}.id`,
          ],
        },
      },
    ])
    .page(current, pageSize)
    .where({
      [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: studentId,
      [`${TABLENAME.FAMILYCOSTRECORD}.status`]: 1,
    })
    .order(`${TABLENAME.FAMILYCOSTRECORD}.create_ts desc`)
    .select();
};
// 查看学员消费记录总数SQL
const getStudentConsumeRecordTotalSql = (data) => {
  const { studentId } = data || {};
  return sql
    .table(TABLENAME.FAMILYCOSTRECORD)
    .field([`count(*) as total`])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: [
            `${TABLENAME.STUDENT}.id`,
          ],
        },
      },
    ])
    .where({
      [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: studentId,
      [`${TABLENAME.FAMILYCOSTRECORD}.status`]: 1,
    })
    .select();
};

// 查看学员消费记录SQL
const getFamilyConsumeRecordSql = (data) => {
  const { familyId, current, pageSize } = data || {};
  return sql
    .table(TABLENAME.FAMILYCOSTRECORD)
    .field([
      `${TABLENAME.FAMILYCOSTRECORD}.id as id`,
      `${TABLENAME.FAMILYCOSTRECORD}.student_id as studentId`,
      `${TABLENAME.STUDENT}.stu_name as stuName`,
      `${TABLENAME.FAMILYCOSTRECORD}.cost as cost`,
      `${TABLENAME.FAMILYCOSTRECORD}.origin_price as originPrice`,
      `${TABLENAME.FAMILYCOSTRECORD}.create_ts as createTime`,
      `${TABLENAME.FAMILYCOSTRECORD}.consume_detail as consumeDetail`,
      `${TABLENAME.FAMILYCOSTRECORD}.discount as discount`,
      `${TABLENAME.FAMILYCOSTRECORD}.consume_num as consumeNum`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: [
            `${TABLENAME.STUDENT}.id`,
          ],
        },
      },
    ])
    .page(current, pageSize)
    .where({
      [`${TABLENAME.FAMILYCOSTRECORD}.family_id`]: familyId,
      [`${TABLENAME.FAMILYCOSTRECORD}.status`]: 1,
    })
    .order(`${TABLENAME.FAMILYCOSTRECORD}.create_ts desc`)
    .select();
};
// 查看学员消费记录总数SQL
const getFamilyConsumeRecordTotalSql = (data) => {
  const { familyId } = data || {};
  return sql
    .table(TABLENAME.FAMILYCOSTRECORD)
    .field([`count(*) as total`])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.FAMILYCOSTRECORD}.student_id`]: [
            `${TABLENAME.STUDENT}.id`,
          ],
        },
      },
    ])
    .where({
      [`${TABLENAME.FAMILYCOSTRECORD}.family_id`]: familyId,
      [`${TABLENAME.FAMILYCOSTRECORD}.status`]: 1,
    })
    .select();
};

module.exports = {
  queryAccountBalanceSql,
  queryAccountBalancesSql,
  getStudentConsumeRecordSql,
  getStudentConsumeRecordTotalSql,
  getFamilyConsumeRecordSql,
  getFamilyConsumeRecordTotalSql,
};
