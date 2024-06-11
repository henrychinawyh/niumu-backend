const dayjs = require("dayjs");
const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  getQueryData,
  toUnderlineData,
  toUnderline,
} = require("../../utils/database");
const { where } = require("sequelize");
const { omit } = require("radash");

// 查询学生列表SQL
const queryStudentSql = (data) => {
  const { current = 1, pageSize = 10, status, ...rest } = data;
  return sql
    .table(TABLENAME.STUDENT)
    .field([
      `${TABLENAME.STUDENT}.id AS id`,
      `IFNULL(${TABLENAME.FAMILYMEMBER}.family_id, "") AS familyId`,
      'IFNULL(birth_date, "") AS birthDate',
      'IFNULL(phone_number, "") AS phoneNumber',
      'IFNULL(stu_name, "") AS stuName',
      'IFNULL(id_card, "") AS idCard',
      `IFNULL(${TABLENAME.STUDENT}.create_ts, "") AS createTs`,
      `IFNULL(${TABLENAME.STUDENT}.update_ts, "") AS updateTs`,
      `${TABLENAME.STUDENT}.status AS status`,
      `${TABLENAME.FAMILYMEMBER}.is_main AS isMain`,
      "sex",
      "age",
      "school_name AS schoolName",
      "has_cousin AS hasCousin",
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.FAMILYMEMBER,
        where: {
          [`${TABLENAME.STUDENT}.id`]: [`${TABLENAME.FAMILYMEMBER}.student_id`],
        },
      },
    ])
    .page(current, pageSize)
    .where({
      ...toUnderlineData(getQueryData(rest)),
      [`${TABLENAME.STUDENT}.status`]: status,
    })
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

// 根据身份证号查询学员
const queryStudentByIdCardSql = (data) => {
  const { idCard } = data;

  return sql
    .table(TABLENAME.STUDENT)
    .where({
      [toUnderline("idCard")]: idCard,
      status: 1,
    })
    .select();
};

// 新建学生SQL
const addStudentSql = (data) => {
  return sql
    .table(TABLENAME.STUDENT)
    .data({
      ...toUnderlineData(data),
      age: dayjs().diff(dayjs(data.birthDate), "year"),
    })
    .insert();
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
const removeStudentSql = (id) => {
  return sql
    .table(TABLENAME.STUDENT)
    .data({
      status: 99,
    })
    .where({ id })
    .update();
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
  queryStudentByIdCardSql,
};
