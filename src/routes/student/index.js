const Router = require("koa-router");
const {
  getStudentList,
  createStudent,
  editStudent,
  deleteStudent,
  getStudent,
  exportStudent,
  getSurplus,
} = require("../../controlller/student");
const { checkSameStu } = require("../../middleware/student.middleware");
const {
  STUDENTPREFIX,
  GETSTUDENTLIST,
  CREATESTUDENT,
  EDITSTUDENT,
  DELETESTUDENT,
  GETSTUDENT,
  EXPORTSTUDENT,
  GETSURPLUS,
} = require("./route");

const router = new Router({
  prefix: STUDENTPREFIX,
});

// 获取学员列表
router.post(GETSTUDENTLIST, getStudentList);

// 新建学员
router.post(CREATESTUDENT, checkSameStu, createStudent);

// 编辑学员
router.post(EDITSTUDENT, editStudent);

// 删除学员
router.post(DELETESTUDENT, deleteStudent);

// 获取单个学员
router.post(GETSTUDENT, getStudent);

// 导出学生表
router.post(EXPORTSTUDENT, exportStudent);

// 查询剩余课销
router.post(GETSURPLUS, getSurplus);

module.exports = router;
