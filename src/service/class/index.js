const { exec, transaction } = require("../../db/seq");
const { EMPTY_DATA } = require("../../utils/constant");
const { compareArrayWithMin } = require("../../utils/database");
const {
  addClassSql,
  hasClassSql,
  queryClassSql,
  queryStudentTotalOfEachClassSql,
  queryClassByIdSql,
  queryClassTotalSql,
  addTeacherForClassSql,
  addStudentsForClassSql,
} = require("./sql");

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
    // 查询是否有班级
    const hasClassRes = await exec(hasClassSql(data));

    if (hasClassRes) {
      return {
        status: 500,
        message: "该班级已存在，请重新输入班级名称",
      };
    }

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
        message: "新增成功",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err?.sqlMessage,
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
      queryClassSql(data), // 查询班级
      queryClassTotalSql(data), // 查询班级总数
    ]);

    if (Array.isArray(list) && list.length) {
      const totalRes = await exec(queryStudentTotalOfEachClassSql(list));

      // 根据查询到的班级，去查询班级里的人数
      list.forEach((item, index) => {
        item.total = totalRes?.[index]?.total || 0;
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
      message: err?.sqlMessage,
    };
  }
};

module.exports = {
  addClass,
  getClass,
};
