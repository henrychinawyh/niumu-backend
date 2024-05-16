const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
  convertIfNull,
  convertJoinWhere,
  toUnderline,
} = require("../../utils/database");

const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");

// 新建教师SQL
const addTeacherSql = (data) =>
  sql.table(TABLENAME.TEACHER).data(toUnderlineData(data)).insert();

// 查询教师SQL
const queryTeacherListSql = (data) => {
  const { current = 1, pageSize = 10 } = data;

  return sql
    .table(TABLENAME.TEACHER)
    .field([
      `${TABLENAME.TEACHER}.id`,
      `${TABLENAME.TEACHER}.status`,
      `${convertIfNull("birthDate")}`,
      `${convertIfNull("phoneNumber")}`,
      `${convertIfNull("teaName")}`,
      `${convertIfNull("idCard")}`,
      `${convertIfNull("createTs", "", TABLENAME.TEACHER)}`,
      `${convertIfNull("updateTs", "", TABLENAME.TEACHER)}`,
      "sex",
      "age",
      `${TABLENAME.COURSE}.name AS courseName`,
    ])
    .join({
      dir: "left",
      table: TABLENAME.COURSE,
      where: [
        {
          [`${TABLENAME.TEACHER}.course_id`]: [`${TABLENAME.COURSE}.id`],
        },
      ],
    })
    .page(current, pageSize)
    .where({
      ...convertJoinWhere(toUnderlineData(getQueryData(data)), {
        status: TABLENAME.TEACHER,
      }),
    })
    .select();
};

// 查询教师列表总数SQL
const queryTeacherListTotalSql = (data) =>
  sql
    .table(TABLENAME.TEACHER)
    .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
    .count("*", "total")
    .select();

// 编辑教师SQL
const editSql = (data) => {
  const { id, ...rest } = data;
  return sql
    .table(TABLENAME.TEACHER)
    .data(toUnderlineData(rest))
    .where({
      id,
    })
    .update();
};

// 删除教师SQL
const removeTeacherSql = (data) => {
  const { ids } = data || {};

  return Array.isArray(ids)
    ? ids.map((id) =>
        sql
          .table(TABLENAME.TEACHER)
          .data({
            status: 99,
          })
          .where({ id })
          .update()
      )
    : [
        sql
          .table(TABLENAME.TEACHER)
          .data({
            status: 99,
          })
          .where({ id: ids })
          .update(),
      ];
};

// 导出教师表SQL
const exportTeaSql = (data) => {
  return sql
    .table(TABLENAME.TEACHER)
    .field([
      'IFNULL(birth_date, "") AS birthDate',
      'IFNULL(phone_number, "") AS phoneNumber',
      'IFNULL(tea_name, "") AS teaName',
      'IFNULL(id_card, "") AS idCard',
      'IFNULL(create_ts, "") AS createTs',
      "sex",
      "age",
    ])
    .page(1, 10000)
    .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
    .select();
};

// 根据任职课程查询教师SQL
const searchTeacherWithCourseSql = (data) => {
  return sql
    .table(TABLENAME.TEACHER)
    .field(convertListToSelectOption(["id", `tea_name`]))
    .where({
      ...toUnderlineData(data),
      status: 1,
    })
    .select();
};

// 根据输入的教师名称查询教师SQL
const searchTeacherByNameSql = (data) => {
  const { teaName } = data;
  return sql
    .tablle(TABLENAME.TEACHER)
    .field(convertListToSelectOption(["id", `tea_name`]))
    .where({
      status: 1,
      [toUnderline("teaName")]: {
        like: `%${teaName}%`,
      },
    })
    .select();
};

module.exports = {
  addTeacherSql,
  queryTeacherListSql,
  queryTeacherListTotalSql,
  editSql,
  removeTeacherSql,
  exportTeaSql,
  searchTeacherWithCourseSql,
  searchTeacherByNameSql,
};
