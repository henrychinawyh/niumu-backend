const { exec } = require("../../db/seq");
const { removeQuotesFromCalculations, responseObject } = require("../../utils");
const { compareArrayWithMin } = require("../../utils/database");
const {
  cancelMemberSql,
  addFamilyPurchaseRecordSql,
} = require("../family/sql");
const {
  queryAccountBalanceSql,
  getStudentConsumeRecordSql,
  getStudentConsumeRecordTotalSql,
  getFamilyConsumeRecordSql,
  getFamilyConsumeRecordTotalSql,
} = require("./sql/query");
const { reduceAccountBalanceSql } = require("./sql/update");

// 减少家庭账户余额
const reduceAccountBalance = async (data) => {
  try {
    data?.studentInfos?.forEach(async (item) => {
      await exec(removeQuotesFromCalculations(reduceAccountBalanceSql(item)));
      const familyRes = await exec(queryAccountBalanceSql(item));

      if (compareArrayWithMin(familyRes)) {
        const balance = familyRes[0].accountBalance;

        if (balance <= 0 && item.isMember === 1) {
          // 取消会员
          await exec(cancelMemberSql(item));
        }

        // 增加消费记录
        await addFamilyPurchaseRecord({
          ...item,
          consumeDetail: data?.consumeDetail,
        });
      }
    });
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 增加家庭的消费记录
const addFamilyPurchaseRecord = async (data) => {
  try {
    await exec(addFamilyPurchaseRecordSql(data));
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 查看学员消费记录
const getStudentConsumeRecord = async (data) => {
  try {
    const list = await getStudentConsumeRecordSql(data);
    const total = await getStudentConsumeRecordTotalSql(data);

    return {
      status: 200,
      data: {
        list,
        total: responseObject(total).total,
      },
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

// 查看家庭消费记录
const getFamilyConsumeRecord = async (data) => {
  try {
    const list = await exec(getFamilyConsumeRecordSql(data));
    const total = await exec(getFamilyConsumeRecordTotalSql(data));

    return {
      status: 200,
      data: {
        list,
        total: responseObject(total).total,
      },
      message: "操作成功",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

module.exports = {
  reduceAccountBalance,
  addFamilyPurchaseRecord,
  getStudentConsumeRecord,
  getFamilyConsumeRecord,
};
