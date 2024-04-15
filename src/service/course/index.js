const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  toUnderlineData,
  compareArrayWithMin,
  getQueryData,
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
        .where({ ...toUnderlineData(getQueryData(data)) })
        .select(),
      sql
        .table(TABLENAME.COURSE)
        .where({ ...toUnderlineData(getQueryData(data)) })
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

module.exports = {
  addCourse,
  queryCourseList,
};
