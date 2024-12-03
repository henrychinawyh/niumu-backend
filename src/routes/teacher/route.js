const TEACHERPREFIX = "/api/teachers";

const CREATETEACHER = "/createTeacher"; // 创建教师
const GETTEACHERLIST = "/getTeacherList"; // 获取教师列表
const DELETETEACHER = "/deleteTeacher"; // 删除教师
const EDITTEACHER = "/editTeacher"; // 编辑教师
const EXPORTTEACHER = "/exportTeacher"; // 导出教师表
const QUERYTEACHERWITHCOURSE = "/queryTeacherWithCourse"; // 按照任职课程查询教师
const QUERYTEACHERBYNAME = "/queryTeacherByName"; // 根据输入的教师名查询教师
const GETTEACHERBYCLASSID = "/getTeacherByClassId"; // 根据班级id，查询班级的任课教师

module.exports = {
  TEACHERPREFIX,
  CREATETEACHER,
  GETTEACHERLIST,
  DELETETEACHER,
  EDITTEACHER,
  EXPORTTEACHER,
  QUERYTEACHERWITHCOURSE,
  QUERYTEACHERBYNAME,
  GETTEACHERBYCLASSID,
};
