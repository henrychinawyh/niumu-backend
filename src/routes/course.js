const Router = require("koa-router");
const {
  createCourse,
  getCourseList,
  deleteCourse,
  editCourse,
  getCourseGrade,
  deleteCourseGrade,
  editCourseGrade,
  getAll,
} = require("../controlller/course");

// 更新课程的同时，也需要编辑课程的级别

const router = new Router({
  prefix: "/api/courses",
});

// 新增课程
router.post("/createCourse", createCourse);

// 获取课程列表
router.post("/getCourseList", getCourseList);

// 获取所有课程
router.post("/getAllCourses", getAll);

// 删除课程
router.post("/deleteCourse", deleteCourse);

// 编辑课程
router.post("/editCourse", editCourse);

// 获取课程的级别
router.post("/getCourseGrade", getCourseGrade);

// 删除课程级别
router.post("/deleteCourseGrade", deleteCourseGrade);

// 编辑课程级别
router.post("/editCourseGrade", editCourseGrade);

module.exports = router;
