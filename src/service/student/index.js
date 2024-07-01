const { omit } = require("radash");
const { exec, sql, transaction } = require("../../db/seq");
const { TABLENAME } = require("../../utils/constant");
const { getQueryData, toUnderlineData } = require("../../utils/database");
const {
  removeFamilyMemberSql,
  queryFamilyMemberByFamilyIdSql,
  delFamilyByFamilyIdSql,
  updateFamilyDetailSql,
  updateFamilyMemberDetailSql,
  addFamilySql,
  queryFamilySql,
  addFamilyMemberSql,
} = require("../family/sql");
const {
  queryStudentSql,
  queryStudentListTotalSql,
  queryOneStudentSql,
  editSql,
  removeStudentSql,
  exportStuSql,
  addStudentSql,
  querySurplusSql,
} = require("./sql");

// 查询学生
const queryStudent = async (data) => {
  const { current = 1, pageSize = 10 } = data;
  try {
    const res = await exec(queryStudentSql(data));

    const total = await exec(queryStudentListTotalSql(data));

    return {
      list: res,
      total: total?.[0]?.total || 0,
      current,
      pageSize,
    };
  } catch (err) {
    console.log(err);
  }
};

// 查询单个学生
const queryOneStudent = async (data) => {
  try {
    const res = await exec(queryOneStudentSql(data));
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 新建学生
const addStudent = async (data) => {
  try {
    const [res, student] = await transaction([
      addStudentSql(omit(data, ["relateWay", "familyId", "familyName"])),
      queryStudentSql({
        idCard: data?.idCard,
      }),
    ]);

    const { id: studentId } = student?.[0] || {};

    if (data?.relateWay) {
      // 新建家庭
      if (data?.relateWay === "0") {
        const [res1, list] = await transaction([
          addFamilySql({
            familyName: data?.familyName,
            mainMemberId: data?.idCard,
          }),
          queryFamilySql({
            mainMemberId: data?.idCard,
          }),
        ]);
        if (list?.length > 0) {
          // 添加家庭与学生的关系
          await exec(
            addFamilyMemberSql({
              studentId,
              familyId: list[0].id,
            }),
          );
        }
      } else {
        // 关联家庭
        await exec(
          addFamilyMemberSql({
            studentId,
            familyId: data?.familyId,
          }),
        );
      }
    }

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 编辑学生
const edit = async (data) => {
  try {
    const res = await exec(editSql(data));
    return res;
  } catch (err) {
    console.log(err);
  }
};

// 删除学生
const removeStudent = async (data) => {
  try {
    const studentIds = data?.map((item) => item?.studentId);

    data?.forEach(async (item) => {
      const { isMain, studentId, familyId } = item;

      if (isMain) {
        // 查询当前家庭下是否有其他成员
        const familyMembers = (
          await exec(queryFamilyMemberByFamilyIdSql({ familyId }))
        ).filter((member) => member.studentId !== studentId);

        if (familyMembers.length > 0) {
          if (
            familyMembers?.every(
              (member) => studentIds.includes(member?.studentId), // 一个家庭中的成员全部被删除
            )
          ) {
            await exec(removeStudentSql(studentId)); // 删除学生id
            await exec(removeFamilyMemberSql({ familyId, studentId })); // 删除学生与家庭的关系
            await exec(delFamilyByFamilyIdSql({ familyId })); // 删除家庭
          } else {
            // 如果是部分学生被删除，找出没有被删除的学生，并且设置他为那个家庭的主成员，被删除的删除学员信息和与家庭的绑定关系
            const delFamilyStudentIds = data
              ?.filter((i) => i.familyId === familyId)
              .map((i) => i.studentId);
            const student = familyMembers.filter(
              (member) => !delFamilyStudentIds.includes(member?.studentId),
            )?.[0]; // 查询到此学生的学生信息，需要将此学生设置为家庭中的主要成员

            await exec(removeStudentSql(studentId)); // 删除学生id
            await exec(removeFamilyMemberSql({ familyId, studentId })); // 删除学生与家庭的关系

            // 给家庭新的主成员信息
            await exec(
              updateFamilyDetailSql({
                familyName: `${student?.studentName}的家庭`,
                mainMemberId: student?.idCard,
                familyId,
              }),
            );
            // 更新家庭成员信息（更新为主成员）
            await exec(
              updateFamilyMemberDetailSql({
                id: student?.familyMemberId,
                isMain: 1,
              }),
            );
          }
        } else {
          // 没有其他家庭成员
          await exec(removeStudentSql(studentId)); // 删除学生id
          await exec(removeFamilyMemberSql({ familyId, studentId })); // 删除学生与家庭的关系
          await exec(delFamilyByFamilyIdSql({ familyId })); // 删除家庭
        }
      } else {
        await exec(removeStudentSql(studentId)); // 删除学生id
        await exec(removeFamilyMemberSql({ familyId, studentId })); // 删除学生与家庭的关系
      }
    });
  } catch (err) {
    console.log(err, "err");
  }
};

// 导出学生表
const exportStu = async (data) => {
  try {
    const res = await exec(exportStuSql(data));

    return res;
  } catch (err) {
    console.log(err);
  }
};

// 查询课销
const querySurplus = async (data) => {
  try {
    const res = await exec(querySurplusSql(data));

    return res;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  queryStudent,
  addStudent,
  removeStudent,
  queryOneStudent,
  exportStu,
  edit,
  querySurplus,
};
