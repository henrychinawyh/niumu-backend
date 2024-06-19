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
} = require("../controlller/class");
const {
  hasClassNameUnderCourseGrade,
  hasClass,
} = require("../middleware/class.middleware");
const {
  hasStudentsInSameCourseGrade,
} = require("../middleware/studentClass.middleware");

const router = new Router({
  prefix: "/api/classes",
});

// 创建班级
router.post(
  "/createClass",
  hasClassNameUnderCourseGrade,
  hasStudentsInSameCourseGrade,
  createClass,
);

// 查询班级
router.post("/getClassList", getClassList);

// 查询班级中对应的学员
router.post("/getStudentsInClass", getStudentsInClass);

// 编辑班级
router.post(
  "/editClass",
  hasClassNameUnderCourseGrade,
  hasStudentsInSameCourseGrade,
  editClass,
);

// 检查某个学员在班级中未销课时
router.post("/hasRemianCourseCount", hasRemianCourseCount);

// 删除班级下的学员
router.post("/deleteStudentOfClass", deleteStudentOfClass);

// 删除班级
router.post("/deleteClass", hasClass, deleteClass);

// 学员转班
router.post("/changeClass", changeClass);

module.exports = router;
