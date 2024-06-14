const { diff } = require("radash");
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
  removeStudentForClassSql,
  editClassNameSql,
  editTeacherForClassSql,
  queryRemianCourseCountSql,
  delStudentSql,
  delClassSql,
  delStudentInAttendanceSql,
} = require("./sql");
const { delTeacherForClassSql } = require("../teacher/sql");

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
    const addClassRes = await transaction([
      addClassSql(data),
      queryClassByIdSql(data),
    ]);

    const [addRes, searchRes] = addClassRes || [];

    if (compareArrayWithMin(searchRes, ">", 0)) {
      // 查找到了班级
      const classId = searchRes[0].id;

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
      message: err?.sqlMessage || err,
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
    const [list, total] = await transaction([
      queryClassSql(data), // 查询班级列表
      queryClassTotalSql(data), // 查询班级列表的总数
    ]);

    if (Array.isArray(list) && list.length) {
      // 查询每个班级的学员
      const [studentList] = await transaction([
        queryStudentOfEachClassSql({
          list: list?.map((item) => item?.classId),
        }),
      ]);

      // 根据查询到的班级，去查询班级里的人数
      list.forEach((item) => {
        const { classId } = item;

        const students = (studentList || [])?.filter(
          (student) => student?.classId === classId,
        );

        item.studentList = students;
        item.total = students?.length;
      });

      return {
        data: {
          list,
          current,
          pageSize,
          total: total?.[0]?.total || 0,
        },
        message: "查询成功",
      };
    } else {
      return EMPTY_DATA.LIST(current, pageSize);
    }
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: err?.sqlMessage || err,
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
      message: err?.sqlMessage || err,
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
    const { classId, studentIds } = data;

    let addStus = [];

    // 1. 查询班级下已存在的学员
    const res = await exec(queryStudentOfEachClassSql({ list: [classId] }));
    if (Array.isArray(res)) {
      const idList = res.map((item) => item.studentId);
      // 要新增的数据
      addStus = diff(studentIds, idList);
    }

    // 3. 执行新增数据的操作
    if (addStus?.length) {
      await transaction([
        ...addStudentsForClassSql({
          studentIds: addStus,
          classId,
        }),
      ]);
    }

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
      message: err?.sqlMessage || err,
    };
  }
};

// 检查某个学员在班级中未销课时
const queryRemianCourseCount = async (data) => {
  try {
    const res = await exec(queryRemianCourseCountSql(data));
    console.log(res, data, "res");
    return {
      status: 200,
      data: res || [],
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err?.sqlMessage || err,
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
      message: err?.sqlMessage || err,
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
      message: err?.sqlMessage || err,
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
};
