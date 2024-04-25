const { TABLENAME } = require("../../utils/constant");
const { exec, sql, transaction } = require("../../db/seq");
const {
  toUnderlineData,
  getQueryData,
  underlineToCamel,
  convertListToSelectOption,
  toUnderline,
  convertIfNull,
} = require("../../utils/database");

// 新建教师
const addTeacher = async (data) => {
  try {
    const res = await exec(
      sql.table(TABLENAME.TEACHER).data(toUnderlineData(data)).insert()
    );

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 查询教师
const queryTeacher = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    const res = await exec(
      sql
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
        .where({ ...toUnderlineData(getQueryData(data)) })
        .select()
    );

    const total = await exec(
      sql
        .table(TABLENAME.TEACHER)
        .where({ ...toUnderlineData(getQueryData(data)) })
        .count("*", "total")
        .select()
    );

    return {
      list: res,
      total: total[0].total || 0,
      current,
      pageSize,
    };
  } catch (err) {
    console.log(err);
  }
};

// 编辑教师
const edit = async (data) => {
  const { id, ...rest } = data;

  try {
    const res = await exec(
      sql
        .table(TABLENAME.TEACHER)
        .data(toUnderlineData(rest))
        .where({
          id,
        })
        .update()
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 删除教师
const removeTeacher = async (data) => {
  const { ids } = data || {};

  try {
    const res = await transaction(
      Array.isArray(ids)
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
          ]
    );
    return res;
  } catch (err) {
    console.log(err, "err");
  }
};

// 导出教师表
const exportTea = async (data) => {
  try {
    const res = await exec(
      sql
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
        .where({ ...toUnderlineData(getQueryData(data)) })
        .select()
    );

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 根据任职课程查询教师
const searchTeacherWithCourse = async (data) => {
  try {
    const res = await exec(
      sql
        .table(TABLENAME.TEACHER)
        .field(convertListToSelectOption(["id", `tea_name`]))
        .where(toUnderlineData(data))
        .select()
    );

    return {
      data: {
        list: res,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

module.exports = {
  addTeacher,
  queryTeacher,
  edit,
  removeTeacher,
  exportTea,
  searchTeacherWithCourse,
};
