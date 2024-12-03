const CLASSPREFIX = "/api/classes";

const CREATECLASS = "/createClass"; // 创建班级
const GETCLASSLIST = "/getClassList"; // 查询班级
const GETSTUDENTSINCLASS = "/getStudentsInClass"; // 查询班级中对应的学员
const EDITCLASS = "/editClass"; // 编辑班级
const HASREMIANCOURSECOUNT = "/hasRemianCourseCount"; // 检查某个学员在班级中未销课时
const DELETESTUDENTOFCLASS = "/deleteStudentOfClass"; // 删除班级下的学员
const DELETECLASS = "/deleteClass"; // 删除班级
const CHANGECLASS = "/changeClass"; // 学员转班
const GETCLASSESDETAIL = "/getClassesDetail"; // 查询班级详情
const ADDSTUDENTTOCLASS = "/addStudentToClass"; // 给班级增加学员

module.exports = {
  CLASSPREFIX,
  CREATECLASS,
  GETCLASSLIST,
  GETSTUDENTSINCLASS,
  EDITCLASS,
  HASREMIANCOURSECOUNT,
  DELETESTUDENTOFCLASS,
  DELETECLASS,
  CHANGECLASS,
  GETCLASSESDETAIL,
  ADDSTUDENTTOCLASS,
};
