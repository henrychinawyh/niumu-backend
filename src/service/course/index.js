const { exec, sql, transaction } = require("../../db/seq");
const { transformData, getTreeDataByLayer } = require("../../utils");
const { TABLENAME, SEMESTER } = require("../../utils/constant");
const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
  compareArrayWithMin,
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
  updateGradeInCourseSql,
  getAllSubjectsSql,
  queryCourseStuTotalSql,
  queryGradeStuTotalSql,
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
      message: err?.sqlMessage || err,
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
      queryCourseStuTotalSql(data),
    ]);

    const [list, total, stuTotal] = res || [];

    if (Array.isArray(list) && list.length) {
      list.forEach((item, index) => {
        item.courseStuTotal = stuTotal?.[index]?.total || 0;
      });
    }

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
      message: err?.sqlMessage || err,
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
    return {
      message: "删除成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage || err,
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
      message: err?.sqlMessage || err,
    };
  }
};

// 获取课程下所有的级别
const getGrade = async (data) => {
  try {
    const res = await transaction([
      getGradeSql(data),
      queryGradeStuTotalSql(data),
    ]);

    const [grades, stuTotal] = res || [];

    if (compareArrayWithMin(grades)) {
      grades.forEach((item, index) => {
        item.gradeStuTotal =
          stuTotal?.filter((stu) => stu.gradeId === item.value)?.[0]?.total ||
          0;
      });
    }

    return {
      data: {
        list: grades,
        total: res?.length || 0,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

// 增加课程的级别
const addGrade = async (data) => {
  try {
    await transaction(
      batchInsertCourseGradeSql({ grades: data?.grades }, data?.courseId),
    );

    return {
      status: 200,
      message: "操作成功",
      data: true,
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

// 删除课程的级别
const delGrade = async (data) => {
  try {
    // 删除级别
    const res = await exec(delGradeSql(data));

    const isSuccess = res?.affectedRows > 0;

    return {
      status: isSuccess ? 200 : 500,
      data: true,
      message: isSuccess ? "操作成功" : "删除失败",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

// 编辑课程级别的名称
const editGrade = async (data) => {
  try {
    // 更新级别名称
    await exec(updateGradeInCourseSql(data));

    return {
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

// 获取课程-级别-班级信息
const getAllSubjects = async (data) => {
  const { layer } = data;

  try {
    const res = await exec(getAllSubjectsSql());
    return {
      data: getTreeDataByLayer(
        transformData(
          res.map((item) => ({
            ...item,
            courseSemesterName: SEMESTER[item.courseSemester],
          })) || [],
        ),
        layer,
      ),
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err?.sqlMessage || err,
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
  getAllSubjects,
  addGrade,
};
