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
  verifyAuth,
} = require("../../middleware/admin.middleware");

const { auth } = require("../../middleware/auth.middleware");
const {
  ADMINSPREFIX,
  REGISTER,
  LOGIN,
  CHANGEPASSWORD,
  GETCURRENTUSER,
} = require("./route");

const router = new Router({
  prefix: ADMINSPREFIX,
});

// 注册接口
router.post(REGISTER, adminValidator, cryptPassword, verifyAdmin, register);

// 登陆接口
router.post(LOGIN, adminValidator, verifyLogin, login);

// 修改密码
router.post(CHANGEPASSWORD, auth, cryptPassword, changePassword);

// 查询管理员
router.get(GETCURRENTUSER, verifyAuth, getCurrentUser);

module.exports = router;
