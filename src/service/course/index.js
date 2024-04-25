const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  getQueryData,
  convertListToSelectOption,
} = require("../../utils/database");

// 添加课程
const addCourse = async (data) => {
  const { name, grades } = data;

  if (!Array.isArray(grades)) {
    return {
      status: 500,
      message: "请填写课程等级",
    };
  }

  try {
    // 查询课程是否已经新建
    await exec(sql.table(TABLENAME.COURSE).where({ name }).select());

    // 插入课程并查询课程id
    const insertRes = await transaction([
      sql
        .table(TABLENAME.COURSE)
        .data({
          name,
        })
        .insert(),
      sql.table(TABLENAME.COURSE).where({ name }).select(),
    ]);

    const selectResData = insertRes?.[1];
    const { id } = selectResData[0];

    // 插入课程级别
    await transaction(
      grades.map((gradeItem) =>
        sql
          .table(TABLENAME.COURSEGRADE)
          .data({
            course_id: id,
            ...gradeItem,
          })
          .insert()
      )
    );

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
      sql
        .table(TABLENAME.COURSE)
        .field([
          "id",
          "name",
          "status",
          'IFNULL(create_ts, "") AS createTs',
          'IFNULL(update_ts, "") AS updateTs',
        ])
        .page(current, pageSize)
        .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
        .select(),
      sql
        .table(TABLENAME.COURSE)
        .where({ ...toUnderlineData(getQueryData(data)), status: 1 })
        .count("*", "total")
        .select(),
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
const getAllCourses = async (data) => {
  try {
    const res = await exec(
      sql
        .table(TABLENAME.COURSE)
        .field(convertListToSelectOption(["id", "name"]))
        .select()
    );
    return {
      data: res,
    };
  } catch (err) {
    console.log(err);
  }
};

// 删除课程
const delCourse = async (data) => {
  const { id, ...rest } = data;

  try {
    await transaction([
      // 删除课程
      sql.table(TABLENAME.COURSE).data({ status: 99 }).where({ id }).update(),
      // 删除课程下所有的级别
      sql
        .table(TABLENAME.COURSEGRADE)
        .data({ status: 99 })
        .where({
          course_id: id,
        })
        .update(),
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
  const { id, ...rest } = data;
  try {
    // 编辑课程名称
    await exec(
      sql
        .table(TABLENAME.COURSE)
        .data(toUnderlineData(rest))
        .where({ id })
        .update()
    );

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
    const res = await exec(
      sql
        .table(TABLENAME.COURSEGRADE)
        .field(["id", "name"])
        .where({
          ...toUnderlineData(data),
          status: 1,
        })
        .select()
    );

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
    await transaction([
      sql
        .table(TABLENAME.COURSEGRADE)
        .data({ status: 99 })
        .where(toUnderlineData(data))
        .update(),
    ]);

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
  const { name, id, ...rest } = data || {};

  try {
    // 查询是否有重名的级别名称
    const res = await exec(
      sql
        .table(TABLENAME.COURSEGRADE)
        .field(["name"])
        .where(toUnderlineData(rest))
        .select()
    );

    if (Array.isArray(res) && res.some((item) => item.name === name)) {
      return {
        status: 500,
        message: "该课程级别名称已存在，请重新命名",
      };
    }

    await exec(
      sql.table(TABLENAME.COURSEGRADE).data({ name }).where({ id }).update()
    );

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
