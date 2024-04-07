const Koa = require("koa");
const { koaBody } = require("koa-body");

const router = require("../routes");
// const userRoutes = require("../routes/admin");
// const indexRoutes = require("../routes/index");

const app = new Koa();

app.use(koaBody());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
