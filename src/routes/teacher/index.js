const Router = require("koa-router");
const {
  createTeacher,
  getTeacherList,
  editTeacher,
  deleteTeacher,
  exportTeacher,
  queryTeacherWithCourse,
  queryTeacherByName,
  getTeacherByClassId,
} = require("../../controlller/teacher");
const {
  TEACHERPREFIX,
  CREATETEACHER,
  GETTEACHERLIST,
  DELETETEACHER,
  EDITTEACHER,
  EXPORTTEACHER,
  QUERYTEACHERWITHCOURSE,
  QUERYTEACHERBYNAME,
  GETTEACHERBYCLASSID,
} = require("./route");

const router = new Router({
  prefix: TEACHERPREFIX,
});

// 创建教师
router.post(CREATETEACHER, createTeacher);

// 获取教师列表
router.post(GETTEACHERLIST, getTeacherList);

// 删除教师
router.post(DELETETEACHER, deleteTeacher);

// 编辑教师
router.post(EDITTEACHER, editTeacher);

// 导出教师表
router.post(EXPORTTEACHER, exportTeacher);

// 按照任职课程查询教师
router.post(QUERYTEACHERWITHCOURSE, queryTeacherWithCourse);

// 根据输入的教师名查询教师
router.post(QUERYTEACHERBYNAME, queryTeacherByName);

// 根据班级id，查询班级的任课教师
router.post(GETTEACHERBYCLASSID, getTeacherByClassId);

module.exports = router;
