const { omit } = require("radash");
const { sql } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { toUnderlineData, toUnderline } = require("../../utils/database");

// 查询家庭信息
const queryFamilySql = (data) => {
  const { familyName, ...rest } = data;

  const whereParams = toUnderlineData(rest);

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
    ])
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

module.exports = {
  queryFamilySql,
  addFamilySql,
  addFamilyMemberSql,
  removeFamilyMemberSql,
  queryFamilyMemberByFamilyIdSql,
  delFamilyByFamilyIdSql,
  updateFamilyDetailSql,
  updateFamilyMemberDetailSql,
};
