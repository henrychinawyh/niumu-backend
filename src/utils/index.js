const redis = require("../config/redis.default");
const { SEMESTER } = require("./constant");
const { compareArrayWithMin } = require("./database");

// 将所有的课程类目转换为树形结构
const transformData = (data) => {
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

const getTreeDataByLayer = (treeData, layer = 3) => {
  if (layer < 1) return [];

  let result = JSON.parse(JSON.stringify(treeData));

  function filterByLayer(nodes, currentLayer) {
    if (currentLayer >= layer) {
      nodes.forEach((node) => {
        node.children = [];
      });
    } else {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          filterByLayer(node.children, currentLayer + 1);
        }
      });
    }
  }

  filterByLayer(result, 1);

  return result;
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

// 返回一个对象的响应
const responseObject = (data) => {
  if (compareArrayWithMin(data, "===", 1)) {
    return data[0];
  }

  return null;
};

// 获取请求接口的url
const getRequestUrl = (ctx) => {
  return ctx.request.url;
};

// 将查询参数转换为redis中的key
const convertToRedisKey = (url, params = {}) => {
  return `${url}-${JSON.stringify(params)}`;
};

// 返回分页查询标准数据格式
const formatListData = (arr) => {
  return {
    list: arr || [],
    total: arr?.length || 0,
  };
};

// 通过scan扫描获取redis中匹配搭配的键
const getKeysByPatternInRedis = async (pattern) => {
  const cacheKeyPattern = pattern;
  let cursor = "0"; // 游标
  const allKeys = [];

  do {
    const result = await redis.scan(cursor, "MATCH", cacheKeyPattern);
    cursor = result[0];

    const keys = result[1];
    allKeys.push(...keys);
  } while (cursor !== "0");

  return allKeys;
};

// 清理redis中的数据
const deleteRedisByKeys = async (keys) => {
  return await redis.del(keys);
};

module.exports = {
  transformData,
  toFixed,
  removeQuotesFromCalculations,
  getTreeDataByLayer,
  responseObject,
  getRequestUrl,
  formatListData,
  getKeysByPatternInRedis,
  convertToRedisKey,
  deleteRedisByKeys,
};
