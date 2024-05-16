const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { getQueryData, toUnderlineData } = require("../../utils/database");
const {
  queryStudentSql,
  queryStudentListTotalSql,
  queryOneStudentSql,
  editSql,
  removeStudentSql,
  exportStuSql,
  addStudentSql,
} = require("./sql");

// 查询学生
const queryStudent = async (data) => {
  const { current = 1, pageSize = 10 } = data;
  try {
    const res = await exec(queryStudentSql(data));

    const total = await exec(queryStudentListTotalSql(data));

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

// 查询单个学生
const queryOneStudent = async (data) => {
  try {
    const res = await exec(queryOneStudentSql(data));
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 新建学生
const addStudent = async (data) => {
  try {
    const res = await exec(addStudentSql(data));

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 编辑学生
const edit = async (data) => {
  try {
    const res = await exec(editSql(data));
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 删除学生
const removeStudent = async (data) => {
  try {
    const res = await transaction(removeStudentSql(data));
    return res;
  } catch (err) {
    console.log(err, "err");
  }
};

// 导出学生表
const exportStu = async (data) => {
  try {
    const res = await exec(exportStuSql(data));

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
