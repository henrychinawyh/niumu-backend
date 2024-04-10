const { exec, sql, transaction } = require("../../db/seq");
const { getLimitData, getQueryData } = require("../../utils/database");

// 查询学生
const queryStudent = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    // todo 分页
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
  console.log(data, "data");
  try {
    const res = await exec(sql.table("student").data(data).insert());

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 编辑学生
const editStudent = async () => {};

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

module.exports = {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
};
