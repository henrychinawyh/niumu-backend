const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { toUnderline } = require("../../utils/database");

/**
 * @name 添加课时SQL
 * @param paidCourseCount 已购买课时
 * @param payment 付款金额
 * @param id 班级-学生id
 * @param realPrice 单价/节
 * @param payId 支付记录id
 */
const addPurchaseRecordSql = (data) => {
  const {
    paidCourseCount,
    totalPayment,
    payment,
    studentClassId,
    studentId,
    realPrice,
    payId,
    eachCoursePrice,
  } = data || {};

  if (!payId) {
    return sql
      .table(TABLENAME.STUDENTPAYCLASSRECORD)
      .data({
        [`${toUnderline("studentClassId")}`]: studentClassId,
        [`${toUnderline("studentId")}`]: studentId,
        [`${toUnderline("paidCourseCount")}`]: paidCourseCount,
        [`${toUnderline("remainCourseCount")}`]: paidCourseCount,
        [`${toUnderline("realPrice")}`]: realPrice,
        payment,
        [`${toUnderline("totalPayment")}`]: totalPayment,
        [`${toUnderline("remainCost")}`]: payment,
        [`${toUnderline("originPrice")}`]: eachCoursePrice,
      })
      .insert();
  } else {
    return `
    UPDATE student_pay_class_record SET 
    ${toUnderline("paidCourseCount")}=${toUnderline("paidCourseCount")}+${paidCourseCount},
    ${toUnderline("remainCourseCount")}=${toUnderline("remainCourseCount")}+${paidCourseCount},
    ${toUnderline("realPrice")}=${realPrice},
    payment=payment+${payment},
    ${toUnderline("remainCost")}=${toUnderline("remainCost")}+${payment},
    ${toUnderline("totalPayment")}=${toUnderline("totalPayment")}+${totalPayment}
    WHERE id=${payId}
    `;
  }
};

module.exports = {
  addPurchaseRecordSql,
};
