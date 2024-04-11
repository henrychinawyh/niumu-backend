const { TABLENAME } = require("../../utils/constant");
const { exec, sql, transaction } = require("../../db/seq");
const { toUnderlineData, getQueryData } = require("../../utils/database");

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
          "id",
          "status",
          'IFNULL(birth_date, "") AS birthDate',
          'IFNULL(phone_number, "") AS phoneNumber',
          'IFNULL(tea_name, "") AS teaName',
          'IFNULL(id_card, "") AS idCard',
          'IFNULL(create_ts, "") AS createTs',
          'IFNULL(update_ts, "") AS updateTs',
          "sex",
          "age",
        ])
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

module.exports = {
  addTeacher,
  queryTeacher,
  edit,
  removeTeacher,
  exportTea,
};
