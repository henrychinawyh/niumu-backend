module.exports = {
  env: {
    browser: true, // 启用浏览器全局变量
    node: true, // 启用Node.js全局变量
    es2021: true, // 启用ES2021语法支持
  },
  extends: [
    "eslint:recommended", // 使用eslint推荐的规则
    "plugin:react/recommended", // 如果你在使用React，可以添加这个插件
  ],
  parserOptions: {
    ecmaVersion: 12, // 使用ECMAScript 2021版本
    sourceType: "module", // 使用ES6模块语法
  },
  rules: {
    // 自定义规则
    semi: ["error", "always"], // 强制使用分号
    quotes: ["error", "single"], // 使用单引号
    "no-console": "warn", // 警告使用console
    "no-unused-vars": "error", // 禁止未使用的变量
    // 如果你在使用React，可以添加更多React相关的规则
    // 'react/prop-types': 'error', // 强制组件属性类型
  },
  settings: {
    react: {
      version: "detect", // 自动检测React版本
    },
  },
};
