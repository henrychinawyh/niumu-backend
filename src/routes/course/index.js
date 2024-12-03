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
  queryAllSubjects,
  addCourseGrade,
  getCourseDetail,
} = require("../../controlller/course");

const {
  hasGradeNameUnderCourse,
  hasGradeNamesUnderCourse,
  hasCourse,
} = require("../../middleware/course.middleware");

// 更新课程的同时，也需要编辑课程的级别

const router = new Router({
  prefix: "/api/courses",
});

// 新增课程
router.post("/createCourse", hasCourse, createCourse);

// 获取课程列表
router.post("/getCourseList", getCourseList);

// 获取所有课程
router.post("/getAllCourses", getAll);

// 删除课程
router.post("/deleteCourse", deleteCourse);

// 编辑课程
router.post("/editCourse", hasCourse, editCourse);

// 获取课程的级别
router.post("/getCourseGrade", getCourseGrade);

// 新增课程级别
router.post("/addCourseGrade", hasGradeNamesUnderCourse, addCourseGrade);

// 删除课程级别
router.post("/deleteCourseGrade", deleteCourseGrade);

// 编辑课程级别
router.post("/editCourseGrade", hasGradeNameUnderCourse, editCourseGrade);

// 查询所有的课程类目
router.post("/getAllSubjects", queryAllSubjects);

// 查询课程-季度-级别信息
router.post("/getCourseDetail", getCourseDetail);

module.exports = router;
