const fs = require("fs");
const Router = require("koa-router");
const router = new Router();

fs.readdir(__dirname, (err, data) => {
  data.forEach((file) => {
    if (file !== "index.js") {
      const r = require(`./${file}`);
      router.use(r.routes());
    }
  });
});

module.exports = router;
