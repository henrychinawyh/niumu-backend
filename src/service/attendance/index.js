const dayjs = require("dayjs");
const { exec, transaction } = require("../../db/seq");
const {
  queryAttendanceListTotalSql,
  queryAttendanceListSql,
  createAttendanceRecordSql,
  updatePayClassRecordSql,
  queryAttendanceRecordSql,
} = require("./sql");

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
    await transaction([
      createAttendanceRecordSql(data),
      updatePayClassRecordSql(data),
    ]);

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
