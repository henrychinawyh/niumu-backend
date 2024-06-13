const { SEMESTER } = require("./constant");

// 将所有的课程类目转换为树形结构
const transformData = (data, showLayer = 3) => {
  const tree = [];

  data.forEach((item) => {
    // Find or create the course node
    let courseNode = tree.find((course) => course.value === item.courseId);
    if (!courseNode) {
      courseNode = {
        label: item.courseName,
        value: item.courseId,
        key: item.courseId,
        children: [],
      };
      tree.push(courseNode);
    }

    // Find or create the course semester node
    let semesterNode = courseNode.children.find(
      (semester) => semester.value === item.courseSemester,
    );
    if (!semesterNode) {
      semesterNode = {
        label: `${SEMESTER[item.courseSemester]}`,
        value: item.courseSemester,
        key: `${item.courseId}-${item.courseSemester}`,
        children: [],
      };
      courseNode.children.push(semesterNode);
    }

    // Find or create the grade node
    let gradeNode = semesterNode.children.find(
      (grade) => grade.value === item.gradeId,
    );
    if (!gradeNode) {
      gradeNode = {
        label: item.gradeName,
        value: item.gradeId,
        key: item.gradeId,
        children: [],
      };
      semesterNode.children.push(gradeNode);
    }

    // Find or create the class node
    if (item.classId) {
      let classNode = gradeNode.children.find(
        (cls) => cls.value === item.classId,
      );
      if (!classNode) {
        classNode = {
          label: item.className,
          value: item.classId,
          key: item.classId,
        };
        gradeNode.children.push(classNode);
      }
    }
  });

  return tree;
};

// 精确计算保留N位小数
const toFixed = (num, digits) => {
  const factor = Math.pow(10, digits);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

// 去掉计算过程中的'
const removeQuotesFromCalculations = (sql) => {
  const pattern = /(\bSET\b\s*.*?=)\s*'([^']+)'/g;

  // 使用正则表达式替换
  const modifiedSql = sql.replace(pattern, (match, p1, p2) => {
    return `${p1} ${p2}`;
  });

  return modifiedSql;
};

module.exports = {
  transformData,
  toFixed,
  removeQuotesFromCalculations,
};
