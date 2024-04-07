const { init, exec, transaction, sql } = require("mysqls");

const {
  MYSQL_DB,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_HOST,
} = require("../config/config.default");

init({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PWD,
  database: MYSQL_DB,
});

module.exports = { exec, transaction, sql };
