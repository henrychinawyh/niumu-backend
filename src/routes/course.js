const Router = require("koa-router");
const { createCourse } = require("../controlller/course");

// 更新课程的同时，也需要编辑课程的级别

const router = new Router({
  prefix: "/api/courses",
});

// 新增课程
router.post("/createCourse", createCourse);

// // 获取课程列表
// router.post("/getCourseList", getCourseList);

// // 删除课程
// router.post("/deleteCourse", deleteCourse);

// // 编辑课程
// router.post("/editCourse", editCourse);

module.exports = router;
