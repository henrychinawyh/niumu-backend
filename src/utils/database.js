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

// 将下划线转成小驼峰
const underlineToCamel = (str) => {
  return str
    .replace(/_([a-z])/g, function (all, letter) {
      return letter.toUpperCase();
    })
    .replace(/^_/, "");
};

// 校验数据是否为数组，比较数组长度和传入最小值
const compareArrayWithMin = (data, opt = ">", min = 0) => {
  if (Array.isArray(data)) {
    switch (opt) {
      case "<":
        return data.length < min;
      case "===":
        return data.length === min;
      case "!==":
        return data.length !== min;
      case "==":
        return data.length == min;
      case "!=":
        return data.length != min;
      case ">=":
        return data.length >= min;
      case "<=":
        return data.length <= min;
      default:
        return data.length > min;
    }
  }

  return false;
};

// 将查询的列表数据转换为下拉列表的格式
const convertListToSelectOption = (data) => {
  if (Array.isArray(data)) {
    return [`${data[0]} AS value`, `${data[1]} AS label`];
  } else {
    return [];
  }
};

// 判断字符串是否为小驼峰格式
const isCamelCase = (str) => {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};

// 处理查询出来的数据为ifNull 然后做特殊处理
const convertIfNull = (str = "", defaultValue = "", dataBaseName) => {
  return `IFNULL(${dataBaseName ? `${dataBaseName}.` : ""}${
    isCamelCase(str) ? toUnderline(str) : str
  }, ${defaultValue || "null"}) AS ${str}`;
};

module.exports = {
  createTableCallback,
  getLimitData,
  getQueryData,
  toUnderline,
  toUnderlineData,
  compareArrayWithMin,
  underlineToCamel,
  convertListToSelectOption,
  convertIfNull,
};
