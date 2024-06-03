const Router = require("koa-router");
const {
  getStudentList,
  createStudent,
  editStudent,
  deleteStudent,
  getStudent,
  exportStudent,
} = require("../controlller/student");
const { checkSameStu } = require("../middleware/student.middleware");

const router = new Router({
  prefix: "/api/students",
});

// 获取学员列表
router.post("/getStudentList", getStudentList);

// 新建学员
router.post("/createStudent", checkSameStu, createStudent);

// 编辑学员
router.post("/editStudent", editStudent);

// 删除学员
router.post("/deleteStudent", deleteStudent);

// 获取单个学员
router.post("/getStudent", getStudent);

// 导出学生表
router.post("/exportStudent", exportStudent);

module.exports = router;
