const { exec, sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");

// 注册管理员
const createAdmin = async (data) => {
  const { username, password } = data;
  try {
    const res = await exec(
      sql.table(TABLENAME.ADMIN).data({ account: username, password }).insert(),
    );

    return {
      status: 200,
      message: res.affectedRows >= 1 ? "写入成功" : "写入失败",
      status: res.affectedRows >= 1 ? 200 : 500,
    };
  } catch (err) {
    return {
      message: err,
      status: 500,
    };
  }
};

// 查询管理员
const queryAdmin = async (data) => {
  let res;
  if (typeof data === "object") {
    res = await exec(sql.table(TABLENAME.ADMIN).select());
  } else {
    res = await exec(
      sql
        .table(TABLENAME.ADMIN)
        .where({
          account: data,
        })
        .select(),
    );
  }

  return res;
};

// 改变管理员信息
const updateById = async ({ id, ...rest }) => {
  const res = await exec(
    sql
      .table(TABLENAME.ADMIN)
      .data(rest)
      .where({
        id,
      })
      .update(),
  );

  return res;
};

// 查询chat-api-key
const queryChatApiKey = async () => {
  const res = await exec(sql.table(TABLENAME.CHATAPIKEY).select());
  return res;
};

module.exports = {
  createAdmin,
  queryAdmin,
  updateById,
  queryChatApiKey,
};
