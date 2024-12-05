const { commonResult } = require("../controlller/common");
const { queryAdmin } = require("../service/admin");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { JWT_SECRET } = require("../config/config.default");

// 验证输入用户名和密码的合法性
const adminValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    commonResult(ctx, {
      message: "用户名或密码为空",
      status: 500,
    });

    return;
  }
  await next();
};

const verifyAdmin = async (ctx, next) => {
  const { username } = ctx.request.body;

  const hasAdmin = await queryAdmin(username);

  if (hasAdmin && hasAdmin.length) {
    commonResult(ctx, {
      message: `管路员 ${username} 已存在，请勿重复注册`,
      status: 409,
    });
    return;
  }

  await next();
};

// 校验登陆
const verifyLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;

  try {
    const res = await queryAdmin(username);

    if (!res) {
      commonResult(ctx, {
        message: `用户名${username}不存在`,
        status: 500,
      });
      return;
    } else {
      if (!bcryptjs.compareSync(password, res?.[0]?.password)) {
        commonResult(ctx, {
          message: `密码输入错误`,
          status: 500,
        });
        return;
      } else {
        ctx.response.body = res;
      }
    }
  } catch (err) {
    commonResult(ctx, {
      message: `用户登录失败：${err}`,
      status: 500,
    });
    return;
  }

  await next();
};

// 加密密码
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;

  let salt = bcryptjs.genSaltSync(10);
  // hash保存的是加密后的password
  let hash = bcryptjs.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
};

// 验证授权
const verifyAuth = async (ctx, next) => {
  const token = ctx.cookies.get("token");

  if (!token) {
    commonResult(ctx, {
      status: 401,
      message: "登录过期，请重新登录",
    });
  } else {
    try {
      const result = jwt.verify(token, JWT_SECRET);
      await next();
    } catch (err) {
      console.log(err);
      commonResult(ctx, {
        status: 401,
        message: "登录过期，请重新登录",
      });
    }
  }
};

module.exports = {
  adminValidator,
  verifyAdmin,
  cryptPassword,
  verifyLogin,
  verifyAuth,
};
