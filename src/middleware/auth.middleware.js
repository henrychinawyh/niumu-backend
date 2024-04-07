const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const { commonResult } = require("../controlller/common");

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");
  try {
    // user中包含 id username, admin_type
    const admin = jwt.verify(token, JWT_SECRET);
    ctx.state.admin = admin;
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        commonResult(ctx, {
          status: 401,
          message: `token已过期`,
        });
        return;
      case "JsonWebTokenError":
        commonResult(ctx, {
          status: 401,
          message: `无效的token`,
        });
        return;
    }
  }
  await next();
};

module.exports = {
  auth,
};
