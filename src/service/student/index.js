const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  getLimitData,
  getQueryData,
  toUnderlineData,
} = require("../../utils/database");

// 查询学生
const queryStudent = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    const res = await exec(
      sql
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
        .select()
    );

    const total = await exec(
      sql
        .table(TABLENAME.STUDENT)
        .where({ ...toUnderlineData(getQueryData(data)) })
        .count("*", "total")
        .select()
    );

    return {
      list: res,
      total: total?.[0]?.total || 0,
      current,
      pageSize,
    };
  } catch (err) {
    console.log(err);
  }
};

// 查询学生
const queryOneStudent = async (data) => {
  const { stuName } = data;
  try {
    const res = await exec(`
    SELECT stu_name AS stuName, id FROM student WHERE stu_name LIKE '${stuName}%' AND status=1
    `);
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 新建学生
const addStudent = async (data) => {
  try {
    const res = await exec(
      sql.table(TABLENAME.STUDENT).data(toUnderlineData(data)).insert()
    );

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 编辑学生
const edit = async (data) => {
  const { id, ...rest } = data;

  try {
    const res = await exec(
      sql
        .table(TABLENAME.STUDENT)
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

// 删除学生
const removeStudent = async (data) => {
  const { ids } = data || {};

  try {
    const res = await transaction(
      Array.isArray(ids)
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
          ]
    );
    return res;
  } catch (err) {
    console.log(err, "err");
  }
};

// 导出学生表
const exportStu = async (data) => {
  try {
    const res = await exec(
      sql
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
        .select()
    );

    return res;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
  exportStu,
  edit,
};
