const { addPurchaseRecordSql } = require("./sql");
const { transaction } = require("../../db/seq");

// 给学员新建课时
const addPurchaseRecord = async (data) => {
  try {
    const { courses } = data;

    await transaction(courses.map((item) => addPurchaseRecordSql(item)));

    // 给学员添加完课时之后需要清除班级学员缓存
    const res = await getKeysByPatternInRedis(
      `${CLASSPREFIX}${GETCLASSESDETAIL}-*`,
    );
    await deleteRedisByKeys(res);

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
