const { exec, transaction } = require("../../db/seq");
const { addFamilySql, queryFamilySql, addFamilyMemberSql } = require("./sql");

// 查询家庭(按条件查询)
const queryFamily = async (data) => {
  try {
    const res = await exec(queryFamilySql(data));

    return {
      status: 200,
      data: {
        list: res,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err.sqlMessage || err,
    };
  }
};

// 新增家庭
const addFamily = async (data) => {
  try {
    // 添加家庭
    const [res, list] = await transaction([
      addFamilySql(data),
      queryFamilySql({
        mainMemberId: data?.mainMemberId,
      }),
    ]);

    if (list?.length > 0) {
      // 添加家庭与学生的关系
      await exec(
        addFamilyMemberSql({
          ...data,
          familyId: list[0].id,
        }),
      );

      return {
        status: 200,
        data: true,
        message: "新建成功",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err.sqlMessage || err,
    };
  }
};

// 新建学员与家庭的关联关系
const createRelationship = async (data) => {
  try {
    await exec(addFamilyMemberSql(data));
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
  queryFamily,
  addFamily,
  createRelationship,
};
