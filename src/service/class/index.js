const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const {
  getQueryData,
  toUnderline,
  compareArrayWithMin,
} = require("../../utils/database");

// 新增班级
const addClass = async (data) => {
  const { courseId, gradeId, name, teacherId, studentIds, ...rest } =
    data || {};
  try {
    const addClassRes = await transaction([
      // 新增班级-关联某个课程下的级别
      sql
        .table(TABLENAME.CLASS)
        .data({
          [toUnderline("gradeId")]: gradeId,
          name,
        })
        .insert(),
      // 查询该班级的班级id
      sql
        .table(TABLENAME.CLASS)
        .field(["id"])
        .where({ name, [toUnderline("gradeId")]: gradeId })
        .select(),
    ]);

    const [addRes, searchRes] = addClassRes || [];

    if (compareArrayWithMin(searchRes, ">", 0)) {
      // 查找到了班级
      const classId = searchRes[0].id;

      await transaction(
        [
          // 关联班级中的老师
          sql
            .table(TABLENAME.TEACHERCLASS)
            .data({
              [toUnderline("teacherId")]: teacherId,
              [toUnderline("classId")]: classId,
            })
            .insert(),
        ].concat(
          // 关联班级中的学生
          Array.isArray(studentIds) &&
            studentIds.map((studentId) =>
              sql.table(TABLENAME.STUDENTCLASS).data({
                [toUnderline("studentId")]: studentId,
                [toUnderline("classId")]: classId,
              })
            )
        )
      );

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

module.exports = {
  addClass,
};
