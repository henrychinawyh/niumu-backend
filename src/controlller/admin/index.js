const { createAdmin, updateById, queryAdmin } = require("../../service/admin");
const { commonResult } = require("../common");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config.default");

class AdminController {
  /**
   * 注册
   * @param {*} ctx
   * @param {*} next
   */
  async register(ctx, next) {
    const { username, password } = ctx.request.body;

    const res = await createAdmin({ username, password });

    commonResult(ctx, res);
  }

  async login(ctx, next) {
    const res = ctx.response.body;
    const admin = res[0];

    // 1. 获取用户信息（在token的payload中，记录id，username，admin_type）
    try {
      const { password, account, ...rest } = admin;

      ctx.cookies.set("username", encodeURIComponent(`${account}`), {
        sameSite: "strict",
      });
      ctx.cookies.set(
        "token",
        encodeURIComponent(
          `${jwt.sign(rest, JWT_SECRET, { expiresIn: "1d" })}`
        ),
        {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "strict",
        }
      );

      commonResult(ctx, {
        message: `欢迎回来, ${admin.account}`,
        status: 200,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // 改变密码
  async changePassword(ctx, next) {
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
      } else {
        commonResult(ctx, {
          status: 500,
          message: "密码未更新成功，请检查服务器问题",
        });
      }
    } catch (err) {
      commonResult(ctx, {
        status: 500,
        message: `密码更新失败：${err}`,
      });
    }
  }

  async getCurrentUser(ctx, next) {
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
  }
}

module.exports = new AdminController();
