const { exec, sql } = require("../../db/seq");

// 查询学生
const queryStudent = async (data) => {
  try {
    // todo 分页
    const res = await exec(sql.table("student").where(data).select());
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

module.exports = {
  queryStudent,
  addStudent,
};
