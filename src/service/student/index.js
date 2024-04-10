const { exec, sql, transaction } = require("../../db/seq");
const { getLimitData, getQueryData } = require("../../utils/database");

// 查询学生
const queryStudent = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    const res = await exec(
      sql
        .table("student")
        .page(current, pageSize)
        .where({ ...getQueryData(data) })
        .select()
    );

    const total = await exec(
      sql
        .table("student")
        .where({ ...getQueryData(data) })
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

// 查询学生
const queryOneStudent = async (data) => {
  const { stuName } = data;
  try {
    const res = await exec(`
    SELECT stuName FROM student WHERE stuName LIKE '${stuName}%' AND status=1
    `);
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 新建学生
const addStudent = async (data) => {
  try {
    const res = await exec(sql.table("student").data(data).insert());

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
        .table("student")
        .data(rest)
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
              .table("student")
              .data({
                status: 99,
              })
              .where({ id })
              .update()
          )
        : [
            sql
              .table("student")
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
        .table("student")
        .page(1, 10000)
        .where({ ...getQueryData(data) })
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
