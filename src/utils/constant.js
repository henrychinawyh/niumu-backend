// 性别
const GENDER = {
  1: "男",
  2: "女",
};

// 数据库表
const TABLENAME = {
  STUDENT: "student",
  ADMIN: "admin",
  TEACHER: "teacher",
  CLASS: "class",
  COURSEGRADE: "course_grade",
  COURSE: "course",
  CLASS: "class",
  STUDENTCLASS: "student_class",
  TEACHERCLASS: "teacher_class",
  STUDENTPAYCLASSRECORD: "student_pay_class_record",
  STUDENTATTENDCOURSERECORD: "student_attend_course_record",
  FAMILY: "family",
  FAMILYMEMBER: "family_member",
  FAMILYCOSTRECORD: "family_cost_record",
};

// 空数据
const EMPTY_DATA = {
  LIST: (current, pageSize) => ({
    data: {
      list: [],
      total: 0,
      current,
      pageSize,
    },
    message: "操作成功",
  }),
};

// 学期
const SEMESTER = {
  1: "春季",
  2: "暑期",
  3: "秋季",
};

module.exports = {
  GENDER,
  TABLENAME,
  EMPTY_DATA,
  SEMESTER,
};
