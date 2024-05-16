const Router = require("koa-router");
const {
  createTeacher,
  getTeacherList,
  editTeacher,
  deleteTeacher,
  exportTeacher,
  queryTeacherWithCourse,
  queryTeacherByName,
} = require("../controlller/teacher");

const router = new Router({
  prefix: "/api/teachers",
});

// 创建教师
router.post("/createTeacher", createTeacher);

// 获取教师列表
router.post("/getTeacherList", getTeacherList);

// 删除教师
router.post("/deleteTeacher", deleteTeacher);

// 编辑教师
router.post("/editTeacher", editTeacher);

// 导出教师表
router.post("/exportTeacher", exportTeacher);

// 按照任职课程查询教师
router.post("/queryTeacherWithCourse", queryTeacherWithCourse);

// 根据输入的教师名查询教师
router.post("/queryTeacherByName", queryTeacherByName);

module.exports = router;
