const { omit } = require("radash");

const createTableCallback = (err, result) => {
  if (err) {
    console.log("创建表失败", err);
  } else {
    console.log("创建表成功", result);
  }
};

// 获取分页参数
const getLimitData = ({ current = 1, pageSize = 10 }) => [
  (Math.max(Math.floor(current), 1) - 1) * pageSize,
  Math.max(Math.floor(current), 1) * pageSize,
];

// 获取查询分页参数
const getQueryData = (data = {}) => omit(data, ["current", "pageSize"]);

// 将小驼峰转换成下划线
const toUnderline = (str) => {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
};

// 将request body中的参数由小驼峰转换为下划线
const toUnderlineData = (data) => {
  return Object.keys(data).reduce((pre, cur) => {
    pre[toUnderline(cur)] = data[cur];
    return pre;
  }, {});
};

module.exports = {
  createTableCallback,
  getLimitData,
  getQueryData,
  toUnderline,
  toUnderlineData,
};
