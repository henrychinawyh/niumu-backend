// eslint-disable-next-line semi
const Router = require("koa-router");
const {
  register,
  login,
  changePassword,
  getCurrentUser,
} = require("../../controlller/admin");
const {
  adminValidator,
  cryptPassword,
  verifyAdmin,
  verifyLogin,
} = require("../../middleware/admin.middleware");

const { auth } = require("../../middleware/auth.middleware");

const router = new Router({
  prefix: "/api/admins",
});

// 注册接口
router.post("/register", adminValidator, cryptPassword, verifyAdmin, register);

// 登陆接口
router.post("/login", adminValidator, verifyLogin, login);

// 修改密码
router.post("/", auth, cryptPassword, changePassword);

// 查询管理员
router.get("/getCurrentUser", getCurrentUser);

module.exports = router;
