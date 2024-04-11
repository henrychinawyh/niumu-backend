const Router = require("koa-router");
const {
  createTeacher,
  getTeacherList,
  editTeacher,
  deleteTeacher,
  exportTeacher,
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

module.exports = router;
