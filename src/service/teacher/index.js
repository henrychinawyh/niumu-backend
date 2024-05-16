const { exec, transaction } = require("../../db/seq");
const {
  addTeacherSql,
  queryTeacherListSql,
  queryTeacherListTotalSql,
  editSql,
  exportTeaSql,
  searchTeacherWithCourseSql,
} = require("./sql");

// 新建教师
const addTeacher = async (data) => {
  try {
    const res = await exec(addTeacherSql(data));

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 查询教师
const queryTeacher = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    const res = await exec(queryTeacherListSql(data));

    const total = await exec(queryTeacherListTotalSql(data));

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
  try {
    const res = await exec(editSql(data));
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 删除教师
const removeTeacher = async (data) => {
  try {
    const res = await transaction(removeTeacherSql(data));
    return res;
  } catch (err) {
    console.log(err, "err");
  }
};

// 导出教师表
const exportTea = async (data) => {
  try {
    const res = await exec(exportTeaSql(data));

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 根据任职课程查询教师
const searchTeacherWithCourse = async (data) => {
  try {
    const res = await exec(searchTeacherWithCourseSql(data));

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

// 根据输入的教师名称查询教师
const searchTeacherByName = async (data) => {
  try {
    const res = await exec(searchTeacherWithCourseSql(data));

    return {
      data: {
        list: res,
      },
    };
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
  searchTeacherWithCourse,
  searchTeacherByName,
};
