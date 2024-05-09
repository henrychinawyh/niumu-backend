module.exports = {
  types: [
    { value: "feat", description: "新增产品功能", emoji: "🎸" },
    { value: "fix", description: "修改bug", emoji: "🐛" },
    { value: "docs", description: "变更文档", emoji: "✏️" },
    {
      value: "style",
      description: "不改变代码功能的变动(如删除空格，格式化，去掉末尾分号等)",
      emoji: "💄",
    },
    {
      value: "refactor",
      description: "重构代码，不包括bug修复，功能新增",
      emoji: "💡",
    },
    { value: "perf", description: "代码优化", emoji: "⚡️" },
    { value: "test", description: "增加，修改测试用例", emoji: "💍" },
    {
      value: "chore",
      description: "对构建工具，库的更改,例如升级 npm 包、修改 webpack 配置",
      emoji: "🤖",
    },
    { value: "revert", description: "回滚commit" },
    { value: "WIP", description: "正在进行中的工作" },
  ],

  scopes: [
    { name: "accounts" },
    { name: "admin" },
    { name: "exampleScope" },
    { name: "changeMe" },
  ],

  //   allowTicketNumber: false,
  //   isTicketNumberRequired: false,
  //   ticketNumberPrefix: "TICKET-",
  //   ticketNumberRegExp: "\\d{1,5}",

  // it needs to match the value for field type. Eg.: 'fix'
  /*
      scopeOverrides: {
        fix: [
          {name: 'merge'},
          {name: 'style'},
          {name: 'e2eTest'},
          {name: 'unitTest'}
        ]
      },
      */
  // 覆写提示的信息
  messages: {
    type: "请选择你要提交的类型:",
    scope: "\n选择一个scope(可选):",
    // used if allowCustomScopes is true
    customScope: "Denote the SCOPE of this change:",
    subject: "请填写一个简短精炼的描述语句(不超过20字符):\n",
    body: '请添加一个详细的描述(可选)，使用"|"换行:\n',
    breaking: "例举非兼容性重大的变更(可选):\n",
    footer: "例举出所有变更的ISSUES CLOSED(可选). 例如.: #31, #34:\n",
    confirmCommit: "确认继续提交?",
  },

  //   allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  // skip any questions you want
  //   skipQuestions: ["body"],

  // limit subject length
  subjectLimit: 20,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
