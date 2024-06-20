const dayjs = require("dayjs");
const { exec, transaction } = require("../../db/seq");
const {
  queryAttendanceListTotalSql,
  queryAttendanceListSql,
  createAttendanceRecordSql,
  updatePayClassRecordSql,
  queryAttendanceRecordSql,
} = require("./sql");
const { queryAccountBalanceSql } = require("../consume/sql/query");
const { responseObject, removeQuotesFromCalculations } = require("../../utils");
const {
  cancelMemberSql,
  addFamilyPurchaseRecordSql,
} = require("../family/sql");
const { reduceAccountBalanceSql } = require("../consume/sql/update");

// 获取考勤列表
const queryAttendanceList = async (data) => {
  const { current, pageSize, costTimeStart, costTimeEnd } = data;

  try {
    const res = await transaction([
      queryAttendanceListSql(data),
      queryAttendanceListTotalSql(data),
    ]);

    const [list, totalRes] = res || [];

    // 查询每个学员考勤的时间
    const attendanceRecords =
      list?.length > 0
        ? await transaction(
            list.map((item) =>
              queryAttendanceRecordSql({
                id: item.id,
                costTimeStart,
                costTimeEnd,
              }),
            ),
          )
        : [];

    attendanceRecords?.forEach((item, index) => {
      list[index].attendanceRecords = item?.map((i) =>
        (i.attendDate ? dayjs(i.attendDate) : dayjs()).format("YYYY-MM-DD"),
      );
    });

    return {
      status: 200,
      data: {
        list: list ?? [],
        current,
        pageSize,
        total: totalRes?.[0]?.total ?? 0,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

/**
 * @name 创建考勤记录
 * @requires 新增一条记录在表student_attend_course_record √
 * @requires 更新student_pay_class_record的数据（remain_course_count，remain_cost）
 */
const createAttendanceRecord = async (data) => {
  try {
    // 查询当前账户
    const accountRes = await exec(queryAccountBalanceSql(data));
    const accountBalance = responseObject(accountRes)?.accountBalance;

    if (+accountBalance && +accountBalance < +data?.realPrice) {
      return {
        status: 500,
        message: "余额不足无法销课，请先充值",
      };
    }

    await transaction(
      [
        // 是否要取消会员
        +accountBalance === data?.realPrice && cancelMemberSql(data),
        // 增加考勤记录
        createAttendanceRecordSql(data),
        // 更新课销记录
        updatePayClassRecordSql(data),
        // 增加家庭的消费记录
        addFamilyPurchaseRecordSql({ ...data, actualPrice: data?.realPrice }),
        // 减少家庭账户余额
        removeQuotesFromCalculations(
          reduceAccountBalanceSql({
            familyId: data?.familyId,
            actualPrice: data?.realPrice,
          }),
        ),
      ].filter((item) => !!item),
    );

    return {
      status: 200,
      data: true,
      message: "操作成功",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err?.sqlMessage || err,
    };
  }
};

module.exports = {
  queryAttendanceList,
  createAttendanceRecord,
};
