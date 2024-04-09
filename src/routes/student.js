const Router = require("koa-router");
const {
  getStudentList,
  createStudent,
  editStudent,
  deleteStudent,
} = require("../controlller/student");

const router = new Router({
  prefix: "/api/students",
});

// 获取学员列表
router.post("/getStudentList", getStudentList);

// 新建学员
router.post("/createStudent", createStudent);

// 编辑学员
router.post("/editStudent", editStudent);

// 删除学员
router.post("/deleteStudent", deleteStudent);

module.exports = router;
