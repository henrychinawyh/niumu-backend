const { createAdmin, updateById, queryAdmin } = require("../../service/admin");
const { commonResult } = require("../common");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config.default");
const { setExpire, get } = require("../../middleware/redis");

class AdminController {
  /**
   * 注册
   * @param {*} ctx
   * @param {*} next
   */
  register = async (ctx) => {
    const { username, password } = ctx.request.body;

    const res = await createAdmin({ username, password });

    commonResult(ctx, res);
  };

  login = async (ctx) => {
    const res = ctx.response.body;
    const admin = res[0];

    // 1. 获取用户信息（在token的payload中，记录id，username，admin_type）
    try {
      const { password, account, ...rest } = admin;
      ctx.cookies.set("username", encodeURIComponent(`${account}`), {
        sameSite: "strict",
      });

      const token = encodeURIComponent(
        `${jwt.sign(rest, JWT_SECRET, { expiresIn: "1d" })}`,
      );
      ctx.cookies.set("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "strict",
      });

      // 将用户信息存入redis
      setExpire(`admin:${account}`, JSON.stringify(token), 24 * 60 * 60);

      commonResult(ctx, {
        message: `欢迎回来, ${admin.account}`,
        status: 200,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 改变密码
  changePassword = async (ctx) => {
    // 1. 获取数据
    const id = ctx.state.admin.id;
    const password = ctx.request.body.password;
    // 2. 操作数据库
    try {
      const res = await updateById({
        id,
        password,
      });
      // 3. 返回结果

      if (res && res.affectedRows > 0) {
        commonResult(ctx, {
          status: 200,
          message: "密码已更新",
        });
      }
    } catch (err) {
      commonResult(ctx, {
        status: 500,
        message: `密码更新失败：${err}`,
      });
    }
  };

  getCurrentUser = async (ctx) => {
    const username = decodeURIComponent(ctx.cookies.get("username"));

    try {
      const res = await queryAdmin(username);
      const data = res[0];

      commonResult(ctx, {
        data,
        status: 200,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new AdminController();
