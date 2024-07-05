const { omit } = require("radash");
const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { toUnderlineData, toUnderline } = require("../../utils/database");

// 查询家庭信息
const queryFamilySql = (data) => {
  const { familyName, current = 1, pageSize = 1000, ...rest } = data;

  const whereParams = toUnderlineData({
    status: 1,
    ...rest,
  });

  if (familyName) {
    whereParams[`${toUnderline("familyName")}`] = {
      like: `%${familyName}%`,
    };
  }

  return sql
    .table(TABLENAME.FAMILY)
    .field([
      "id",
      "family_name AS familyName",
      "is_member AS isMember",
      "account_balance AS accountBalance",
      "main_member_id AS mainMemberId",
      "create_ts as createTime",
      "discount",
    ])
    .page(current, pageSize)
    .where(whereParams)
    .select();
};

// 查询家庭总数
const queryFamilyListTotalSql = (data) => {
  const { familyName, ...rest } = data;

  const whereParams = toUnderlineData({
    status: 1,
    ...omit(rest, ["current", "pageSize"]),
  });

  if (familyName) {
    whereParams[`${toUnderline("familyName")}`] = {
      like: `%${familyName}%`,
    };
  }

  return sql
    .table(TABLENAME.FAMILY)
    .field(["count(*) as total"])
    .where(whereParams)
    .select();
};

// 新建家庭
const addFamilySql = (data) => {
  return sql
    .table(TABLENAME.FAMILY)
    .data(toUnderlineData(omit(data, ["studentId"])))
    .insert();
};

// 建立学员与家庭的关系
const addFamilyMemberSql = (data) => {
  const { studentId, familyId, mainMemberId } = data;

  const insertData = {
    ...toUnderlineData({
      studentId,
      familyId,
    }),
  };

  if (mainMemberId) {
    insertData["is_main"] = 1;
  }

  return sql.table(TABLENAME.FAMILYMEMBER).data(insertData).insert();
};

/**
 * @name 删除学员与家庭的关系
 * @param  familyId 家庭id
 * @param  studentId 学员id
 */
const removeFamilyMemberSql = (data) => {
  return sql
    .table(TABLENAME.FAMILYMEMBER)
    .data({
      status: 99,
      is_main: 0,
    })
    .where(toUnderlineData(data))
    .update();
};

/**
 * @name 根据家庭id查询家庭成员
 * @param familyId 家庭id
 */
const queryFamilyMemberByFamilyIdSql = (data) => {
  const { familyId } = data;

  return sql
    .table(TABLENAME.FAMILYMEMBER)
    .field([
      `${TABLENAME.STUDENT}.stu_name AS studentName`,
      `${TABLENAME.FAMILYMEMBER}.id AS familyMemberId`,
      `family_id AS familyId`,
      `student_id AS studentId`,
      `is_main AS isMain`,
      `${TABLENAME.FAMILYMEMBER}.status AS status`,
      `${TABLENAME.STUDENT}.id_card AS idCard`,
    ])
    .join([
      {
        dir: "left",
        table: TABLENAME.STUDENT,
        where: {
          [`${TABLENAME.STUDENT}.id`]: [`${TABLENAME.FAMILYMEMBER}.student_id`],
        },
      },
    ])
    .where({
      [`${TABLENAME.FAMILYMEMBER}.family_id`]: familyId,
      [`${TABLENAME.FAMILYMEMBER}.status`]: 1,
      [`${TABLENAME.STUDENT}.status`]: 1,
    })
    .select();
};

/**
 * @name 根据家庭id删除家庭
 * @param familyId 家庭id
 */
const delFamilyByFamilyIdSql = (data) => {
  const { familyId } = data;

  return sql
    .table(TABLENAME.FAMILY)
    .data({
      status: 99,
    })
    .where({ id: familyId })
    .update();
};

/**
 * @name 更改家庭信息
 */
const updateFamilyDetailSql = (data) => {
  const { familyId, ...rest } = data || {};

  return sql
    .table(TABLENAME.FAMILY)
    .data(toUnderlineData(rest))
    .where({
      status: 1,
      id: familyId,
    })
    .update();
};

/**
 * @name 更改家庭成员信息
 */
const updateFamilyMemberDetailSql = (data) => {
  const { id, ...rest } = data || {};

  return sql
    .table(TABLENAME.FAMILYMEMBER)
    .data(toUnderlineData(rest))
    .where({ id, status: 1 })
    .update();
};

/**
 * @name 家庭账户办理会员信息
 * @param familyId 家庭id
 * @param isMember 是否是会员
 * @param discount 折扣
 * @param accountBalance 充值金额
 */
const createMemberSql = (data) => {
  const { familyId, accountBalance, discount } = data;
  return sql
    .table(TABLENAME.FAMILY)
    .data({
      discount,
      [toUnderline("isMember")]: 1,
      [toUnderline("accountBalance")]:
        `${toUnderline("accountBalance")} + ${accountBalance}`,
    })
    .where({
      id: familyId,
      status: 1,
    })
    .update();
};

/**
 * @name 充值账户
 * @param familyId 家庭id
 * @param accountBalance 充值金额
 */
const rechargeAccountSql = (data) => {
  const { familyId, accountBalance } = data;

  return sql
    .table(TABLENAME.FAMILY)
    .data({
      [toUnderline("accountBalance")]:
        `${toUnderline("accountBalance")} + ${accountBalance}`,
    })
    .where({
      id: familyId,
      status: 1,
    })
    .update();
};

// 取消会员资格SQL
const cancelMemberSql = (data) => {
  const { familyId } = data;
  return sql
    .table(TABLENAME.FAMILY)
    .data({
      [toUnderline("isMember")]: 0,
      discount: 1,
    })
    .where({
      id: familyId,
      status: 1,
    })
    .update();
};

// 增加消费记录SQL
const addFamilyPurchaseRecordSql = (data) => {
  const {
    familyId,
    studentId,
    consumeDetail,
    isMember,
    discount,
    originPrice,
    actualPrice,
    consumeNum,
  } = data || {};

  return sql
    .table(TABLENAME.FAMILYCOSTRECORD)
    .data(
      toUnderlineData({
        familyId,
        studentId,
        consumeDetail,
        isMember,
        discount,
        originPrice,
        actualPrice,
        consumeNum,
        cost: actualPrice,
      }),
    )
    .insert();
};

module.exports = {
  queryFamilySql,
  addFamilySql,
  addFamilyMemberSql,
  removeFamilyMemberSql,
  queryFamilyMemberByFamilyIdSql,
  delFamilyByFamilyIdSql,
  updateFamilyDetailSql,
  updateFamilyMemberDetailSql,
  queryFamilyListTotalSql,
  createMemberSql,
  rechargeAccountSql,
  cancelMemberSql,
  addFamilyPurchaseRecordSql,
};
