// 将所有的课程类目转换为树形结构
const transformData = (data, showLayer = 3) => {
  const courseMap = new Map();

  data.forEach(
    ({ courseId, courseName, gradeId, gradeName, classId, className }) => {
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          key: courseId,
          label: courseName,
          value: courseId,
          children: new Map(),
        });
      }

      const course = courseMap.get(courseId);

      if (!course.children.has(gradeId)) {
        showLayer >= 2 &&
          course.children.set(gradeId, {
            key: gradeId,
            value: gradeId,
            label: gradeName,
            children: [],
          });
      }

      const grade = course.children.get(gradeId);

      classId &&
        showLayer === 3 &&
        grade &&
        grade.children.push({
          key: classId,
          value: classId,
          label: className,
        });
    },
  );

  // Convert Maps to Arrays
  const result = Array.from(courseMap.values()).map((course) => ({
    ...course,
    children: Array.from(course.children.values()),
  }));

  return result;
};

// 精确计算保留N位小数
const toFixed = (num, digits) => {
  const factor = Math.pow(10, digits);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

module.exports = {
  transformData,
  toFixed,
};
