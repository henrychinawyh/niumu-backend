const Router = require("koa-router");
const {
  createClass,
  getClassList,
  getStudentsInClass,
  editClass,
  hasRemianCourseCount,
  deleteStudentOfClass,
  deleteClass,
  changeClass,
  getClassesDetail,
  addStudent,
} = require("../../controlller/class");
const {
  hasClassNameUnderCourseGrade,
  hasClass,
  queryStudentInClassBeforeChangeClass,
} = require("../../middleware/class.middleware");
const {
  hasStudentsInSameCourseGrade,
} = require("../../middleware/studentClass.middleware");
const {
  getClassDetailByRedis,
} = require("../../middleware/redis/classRedis.middleware");
const {
  CREATECLASS,
  GETCLASSLIST,
  GETSTUDENTSINCLASS,
  EDITCLASS,
  HASREMIANCOURSECOUNT,
  DELETESTUDENTOFCLASS,
  DELETECLASS,
  CHANGECLASS,
  GETCLASSESDETAIL,
  ADDSTUDENTTOCLASS,
  CLASSPREFIX,
} = require("./route");

const router = new Router({
  prefix: CLASSPREFIX,
});

// 创建班级
router.post(
  CREATECLASS,
  hasClassNameUnderCourseGrade,
  hasStudentsInSameCourseGrade,
  createClass,
);

// 查询班级
router.post(GETCLASSLIST, getClassList);

// 查询班级中对应的学员
router.post(GETSTUDENTSINCLASS, getStudentsInClass);

// 编辑班级
router.post(EDITCLASS, editClass);

// 检查某个学员在班级中未销课时
router.post(HASREMIANCOURSECOUNT, hasRemianCourseCount);

// 删除班级下的学员
router.post(DELETESTUDENTOFCLASS, deleteStudentOfClass);

// 删除班级
router.post(DELETECLASS, hasClass, deleteClass);

// 学员转班
router.post(CHANGECLASS, queryStudentInClassBeforeChangeClass, changeClass);

// 查询班级详情
router.post(GETCLASSESDETAIL, getClassDetailByRedis, getClassesDetail);

// 给班级增加学员
router.post(ADDSTUDENTTOCLASS, hasStudentsInSameCourseGrade, addStudent);

module.exports = router;
