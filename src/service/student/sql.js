const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  getQueryData,
  toUnderlineData,
  toUnderline,
} = require("../../utils/database");

// 查询学生列表SQL
const queryStudentSql = (data) => {
  const { current = 1, pageSize = 10 } = data;
  return sql
    .table(TABLENAME.STUDENT)
    .field([
      "id",
      "status",
      'IFNULL(birth_date, "") AS birthDate',
      'IFNULL(phone_number, "") AS phoneNumber',
      'IFNULL(stu_name, "") AS stuName',
      'IFNULL(id_card, "") AS idCard',
      'IFNULL(create_ts, "") AS createTs',
      'IFNULL(update_ts, "") AS updateTs',
      "sex",
      "age",
    ])
    .page(current, pageSize)
    .where({ ...toUnderlineData(getQueryData(data)) })
    .select();
};

// 查询学生列表总数SQL
const queryStudentListTotalSql = (data) => {
  return sql
    .table(TABLENAME.STUDENT)
    .where({ ...toUnderlineData(getQueryData(data)) })
    .count("*", "total")
    .select();
};

// 查询单个学生SQL
const queryOneStudentSql = (data) => {
  const { stuName } = data;

  return sql
    .table(TABLENAME.STUDENT)
    .field([`${toUnderline("stuName")} AS stuName`, "id"])
    .where({
      [toUnderline("stuName")]: {
        like: `%${stuName}%`,
      },
      status: 1,
    })
    .select();
};

// 新建学生SQL
const addStudentSql = (data) => {
  return sql.table(TABLENAME.STUDENT).data(toUnderlineData(data)).insert();
};

// 编辑学生SQL
const editSql = (data) => {
  const { id, ...rest } = data;

  return sql
    .table(TABLENAME.STUDENT)
    .data(toUnderlineData(rest))
    .where({
      id,
    })
    .update();
};

// 删除学生SQL
const removeStudentSql = (data) => {
  const { ids } = data || {};

  return Array.isArray(ids)
    ? ids.map((id) =>
        sql
          .table(TABLENAME.STUDENT)
          .data({
            status: 99,
          })
          .where({ id })
          .update()
      )
    : [
        sql
          .table(TABLENAME.STUDENT)
          .data({
            status: 99,
          })
          .where({ id: ids })
          .update(),
      ];
};

// 导出学生表SQL
const exportStuSql = (data) => {
  return sql
    .table(TABLENAME.STUDENT)
    .field([
      'IFNULL(birth_date, "") AS birthDate',
      'IFNULL(phone_number, "") AS phoneNumber',
      'IFNULL(stu_name, "") AS stuName',
      'IFNULL(id_card, "") AS idCard',
      'IFNULL(create_ts, "") AS createTs',
      "sex",
      "age",
    ])
    .page(1, 10000)
    .where({ ...toUnderlineData(getQueryData(data)) })
    .select();
};

module.exports = {
  queryStudentSql,
  queryStudentListTotalSql,
  queryOneStudentSql,
  addStudentSql,
  editSql,
  removeStudentSql,
  exportStuSql,
};
