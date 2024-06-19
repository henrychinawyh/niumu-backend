const { sql } = require("../../../db/seq");
const { TABLENAME } = require("../../../utils/constant");

// 减少家庭账户余额SQL
const reduceAccountBalanceSql = (data) => {
  const { familyId, actualPrice } = data;

  return sql
    .table(TABLENAME.FAMILY)
    .data({ account_balance: `account_balance - ${actualPrice}` })
    .where({ id: familyId })
    .update();
};

module.exports = {
  reduceAccountBalanceSql,
};
