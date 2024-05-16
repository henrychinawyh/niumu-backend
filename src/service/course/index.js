const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
} = require("../../utils/database");
const {
  hasCourseSql,
  insertCourseSql,
  queryCourseId,
  batchInsertCourseGradeSql,
  queryCourseListSql,
  queryCourseListTotalSql,
  getAllCoursesSql,
  removeCourseSql,
  removeCourseGradeSql,
  editSql,
  getGradeSql,
  delGradeSql,
  hasGradeInCourse,
  updateGradeInCourseSql,
} = require("./sql");

// 添加课程
const addCourse = async (data) => {
  const { grades } = data;

  if (!Array.isArray(grades)) {
    return {
      status: 500,
      message: "请填写课程等级",
    };
  }

  try {
    // 查询课程是否已经新建
    const hasCourse = await exec(hasCourseSql(data));
    if (hasCourse?.length) {
      return {
        status: 500,
        message: "课程已存在",
      };
    }

    // 插入课程并查询课程id
    const insertRes = await transaction([
      insertCourseSql(data),
      queryCourseId(data),
    ]);

    const selectResData = insertRes?.[1];
    const { id } = selectResData[0];

    // 插入课程级别
    await transaction(batchInsertCourseGradeSql(data, id));

    return {
      status: 200,
      message: "添加课程成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 获取课程列表
const queryCourseList = async (data) => {
  const { current = 1, pageSize = 10 } = data;

  try {
    const res = await transaction([
      queryCourseListSql(data),
      queryCourseListTotalSql(data),
    ]);

    const [list, total] = res || [];

    return {
      data: {
        list,
        total: total?.[0]?.total || 0,
        current,
        pageSize,
      },
      status: 200,
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 获取所有课程
const getAllCourses = async () => {
  try {
    const res = await exec(getAllCoursesSql());
    return {
      data: res,
    };
  } catch (err) {
    console.log(err);
  }
};

// 删除课程
const delCourse = async (data) => {
  try {
    await transaction([
      // 删除课程
      removeCourseSql(data),
      // 删除课程下所有的级别
      removeCourseGradeSql(data),
    ]);
    // todo 删除所有课程下的班级
    // todo 删除所有班级下绑定的学员
    return {
      message: "删除成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 编辑课程
const edit = async (data) => {
  try {
    // 编辑课程名称
    await exec(editSql(data));

    return {
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 获取课程下所有的级别
const getGrade = async (data) => {
  try {
    const res = await exec(getGradeSql(data));

    return {
      data: {
        list: res,
        total: res?.length || 0,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 删除课程的级别
const delGrade = async (data) => {
  try {
    // 删除级别
    await transaction([delGradeSql(data)]);

    // todo 删除级别下的班级
    // todo 删除级别下的班级以及班级里的学员

    return {
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

// 编辑课程级别的名称
const editGrade = async (data) => {
  const { name } = data || {};

  try {
    // 查询是否有重名的级别名称
    const res = await exec(hasGradeInCourse(data));

    if (Array.isArray(res) && res.some((item) => item.name === name)) {
      return {
        status: 500,
        message: "该课程级别名称已存在，请重新命名",
      };
    }

    // 更新级别名称
    await exec(updateGradeInCourseSql(data));

    return {
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
    };
  }
};

module.exports = {
  addCourse,
  queryCourseList,
  delCourse,
  edit,
  getGrade,
  delGrade,
  editGrade,
  getAllCourses,
};
