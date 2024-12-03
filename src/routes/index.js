const fs = require("fs");
const Router = require("koa-router");
const router = new Router();

fs.readdir(__dirname, (err, data) => {
  data.forEach((file) => {
    if (file !== "index.js") {
      fs.readdir(`${__dirname}/${file}`, (err1, data1) => {
        data1.forEach((file1) => {
          if (file1 === "index.js") {
            const r = require(`${__dirname}/${file}/${file1}`);
            router.use(r.routes());
          }
        });
      });
    }
  });
});

module.exports = router;
