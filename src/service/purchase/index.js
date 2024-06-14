const { toFixed } = require("../../utils");
const { addPurchaseRecordSql } = require("./sql");
const { transaction, exec } = require("../../db/seq");

// 给学员新建课时
const addPurchaseRecord = async (data) => {
  try {
    const { courses } = data;

    await transaction(courses.map((item) => addPurchaseRecordSql(item)));

    return {
      status: 200,
      data: true,
      message: "新建成功",
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: err.sqlMessage || err,
    };
  }
};

module.exports = {
  addPurchaseRecord,
};
