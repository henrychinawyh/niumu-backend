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
const {
  COURSEPREFIX,

  CREATECOURSE,
  GETCOURSELIST,
  GETALLCOURSES,
  DELETECOURSE,
  EDITCOURSE,
  GETCOURSEGRADE,
  ADDCOURSEGRADE,
  DELETECOURSEGRADE,
  EDITCOURSEGRADE,
  GETALLSUBJECTS,
  GETCOURSEDETAIL,
} = require("./route");

// 更新课程的同时，也需要编辑课程的级别

const router = new Router({
  prefix: COURSEPREFIX,
});

// 新增课程
router.post(CREATECOURSE, hasCourse, createCourse);

// 获取课程列表
router.post(GETCOURSELIST, getCourseList);

// 获取所有课程
router.post(GETALLCOURSES, getAll);

// 删除课程
router.post(DELETECOURSE, deleteCourse);

// 编辑课程
router.post(EDITCOURSE, hasCourse, editCourse);

// 获取课程的级别
router.post(GETCOURSEGRADE, getCourseGrade);

// 新增课程级别
router.post(ADDCOURSEGRADE, hasGradeNamesUnderCourse, addCourseGrade);

// 删除课程级别
router.post(DELETECOURSEGRADE, deleteCourseGrade);

// 编辑课程级别
router.post(EDITCOURSEGRADE, hasGradeNameUnderCourse, editCourseGrade);

// 查询所有的课程类目
router.post(GETALLSUBJECTS, queryAllSubjects);

// 查询课程-季度-级别信息
router.post(GETCOURSEDETAIL, getCourseDetail);

module.exports = router;
