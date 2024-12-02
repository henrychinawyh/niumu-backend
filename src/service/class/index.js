const { exec, transaction, sql } = require("../../db/seq");
const { EMPTY_DATA, TABLENAME } = require("../../utils/constant");
const { compareArrayWithMin, toUnderline } = require("../../utils/database");
const {
  addClassSql,
  queryClassSql,
  queryClassByIdSql,
  queryClassTotalSql,
  addTeacherForClassSql,
  addStudentsForClassSql,
  queryStudentOfEachClassSql,
  editClassNameSql,
  editTeacherForClassSql,
  queryRemianCourseCountSql,
  delStudentSql,
  delClassSql,
  delStudentInAttendanceSql,
  queryClassDetailSql,
  queryStudentTotalOfEachClassSql,
  addStudentToClassSql,
} = require("./sql");
const { addPurchaseRecordSql } = require("../purchase/sql");
const { delTeacherForClassSql } = require("../teacher/sql");
const { omit } = require("lodash");

/**
 * @name 查询添加的学员是否已在同课程同级别下的班级已存在
 */

/**
 * @name 新增班级
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} teacherId 教师id
 * @param {String} name 班级名称
 * @param {Array<Number>} studentIds 学生集合
 *
 * @returns void
 */
const addClass = async (data) => {
  const { teacherId, studentIds } = data || {};

  try {
    // 添加班级
    // 新建班级
    const { insertId } = await exec(addClassSql(data));

    if (insertId) {
      // 查找到了班级
      const classId = insertId;

      await transaction([
        // 将老师关联到班级中
        addTeacherForClassSql({
          classId,
          teacherId,
        }),
        // 将学生关联到班级中
        ...addStudentsForClassSql({
          classId,
          studentIds,
        }),
      ]);
      return {
        status: 200,
        data: true,
        message: "新增成功",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

/**
 * @name 查询班级信息
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} classId 班级id
 * @param {Number} current 当前页码
 * @param {Number} pageSize 每页条数
 * @param {String} name 教师名称
 *
 * @return 课程名称,课程id,级别名称,级别id,班级名称,班级id,教师名称,教师id,当前班级的学员总数,创建时间
 */
const getClass = async (data) => {
  const { current, pageSize } = data || {};
  try {
    // 查询班级
    const list = await exec(queryClassSql(data));
    const total = await exec(queryClassTotalSql(data));

    // 查询班级人数
    let studentTotal = [];

    if (list?.length > 0) {
      studentTotal = await exec(queryStudentTotalOfEachClassSql(list));
    }

    return {
      data: {
        list: list.map((item, index) => ({
          ...item,
          studentTotal: studentTotal?.find(
            (totalItem) => totalItem?.classId === item?.classId,
          )?.total,
        })),
        total,
        current,
        pageSize,
      },
      status: 200,
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: err,
    };
  }
};

/**
 * @name 查询班级下的学员
 * @param {Number} classId 班级id
 */
const queryStudentOfEachClass = async (data) => {
  try {
    const res = await exec(queryStudentOfEachClassSql(data));

    return {
      data: {
        list: res,
        total: res?.length,
      },
      status: 200,
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

/**
 * @name 编辑班级
 * @param {Number} courseId 课程id
 * @param {Number} gradeId 级别id
 * @param {Number} teacherId 教师id
 * @param {String} name 班级名称
 * @param {Array<Number>} studentIds 学生集合
 */
const editClassByClassId = async (data) => {
  try {
    // 修改班级名称和任课教师
    await transaction([
      editClassNameSql(data), // 修改班级名称
      editTeacherForClassSql(data), // 修改班级的任课教师
    ]);

    return {
      status: 200,
      data: true,
      message: "操作成功",
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: err,
    };
  }
};

// 检查某个学员在班级中未销课时
const queryRemianCourseCount = async (data) => {
  try {
    const res = await exec(queryRemianCourseCountSql(data));

    return {
      status: 200,
      data: res || [],
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err,
    };
  }
};

// 删除班级下的学生,并且需要将学员从考勤中也删除
const delStudent = async (data) => {
  try {
    await transaction([delStudentSql(data), delStudentInAttendanceSql(data)]);

    return {
      status: 200,
      data: true,
      message: "删除成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 删除班级
const delClass = async (data) => {
  try {
    const res = await transaction([
      delClassSql(data),
      delTeacherForClassSql(data),
    ]);
    const isSuccess = res?.[0]?.affectedRows > 0;

    return {
      status: isSuccess ? 200 : 500,
      data: isSuccess,
      message: isSuccess ? "删除成功" : "删除失败",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 学员转班
const changeStudentClass = async (data) => {
  try {
    if (data?.payId) {
      const [res1, res2, res3] = await transaction([
        // 删除学员与原班级之间的关系
        // 将之前的班级的购买记录设置为失效
        delStudentSql(data),
        delStudentInAttendanceSql(data),

        // 新增学员与现班级之间的关系
        ...addStudentsForClassSql({
          classId: data?.classId,
          studentIds: [data?.studentId],
        }),
      ]);
      if (res3?.insertId) {
        // 添加新的购买记录
        await exec(
          addPurchaseRecordSql(
            Object.assign({}, omit(data, ["studentClassId", "payId"]), {
              studentClassId: res3?.insertId,
            }),
          ),
        );
      }
    } else {
      const [res1, res2] = await transaction([
        // 删除学员与原班级之间的关系
        delStudentSql(data),

        // 新增学员与现班级之间的关系
        ...addStudentsForClassSql({
          classId: data?.classId,
          studentIds: [data?.studentId],
        }),
      ]);

      if (res2?.insertId) {
        // 添加新的购买记录
        await exec(
          addPurchaseRecordSql(
            Object.assign({}, omit(data, "studentClassId"), {
              studentClassId: res2?.insertId,
            }),
          ),
        );
      }
    }

    return {
      status: 200,
      data: true,
      message: "操作成功",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err,
    };
  }
};

// 查询班级详情
const queryClassesDetail = async (data) => {
  try {
    const res = await exec(queryClassDetailSql(data));

    console.log(res, "res");

    return {
      status: 200,
      data: {
        list: res || [],
        total: res?.length || 0,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 给班级添加学员
const addStudentToClass = async (data) => {
  try {
    await transaction(addStudentToClassSql(data));

    return {
      status: 200,
      data: true,
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

module.exports = {
  addClass,
  getClass,
  queryStudentOfEachClass,
  editClassByClassId,
  queryRemianCourseCount,
  delStudent,
  delClass,
  changeStudentClass,
  queryClassesDetail,
  addStudentToClass,
};
