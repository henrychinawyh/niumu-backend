const { exec, transaction } = require("../../db/seq");
const {
  queryAttendanceListTotalSql,
  queryAttendanceListSql,
} = require("./sql");

// 获取考勤列表
const queryAttendanceList = async (data) => {
  const { current, pageSize } = data;

  try {
    const res = await transaction([
      queryAttendanceListSql(data),
      queryAttendanceListTotalSql(data),
    ]);

    const [list, totalRes] = res || [];

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

module.exports = {
  queryAttendanceList,
};
