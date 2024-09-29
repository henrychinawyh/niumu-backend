CREATE TABLE student (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  birth_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生日',
  phone_number varchar(100) NOT NULL COMMENT '联系方式，用英文逗号隔开',
  stu_name varchar(50) NOT NULL COMMENT '学生姓名',
  sex int(11) NOT NULL DEFAULT '1' COMMENT '1 男 2 女',
  age int(11) DEFAULT NULL COMMENT '年龄',
  id_card varchar(20) NOT NULL COMMENT '身份证号',
  school_name varchar(50) DEFAULT NULL COMMENT '就读学校',
  has_cousin varchar(20) DEFAULT NULL COMMENT '是否有兄弟姐妹，用英文逗号隔开 0 姐姐 1 妹妹 2 哥哥 3 弟弟',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stu_name (stu_name),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='学员表'

CREATE TABLE family (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '家庭id',
  family_name varchar(20) NOT NULL COMMENT '家庭名字',
  is_member int(11) NOT NULL DEFAULT '0' COMMENT '是否是会员 0 否 1 是',
  discount decimal(10,2) NOT NULL DEFAULT '1.00',
  account_balance decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',
  main_member_id varchar(20) NOT NULL COMMENT '主要家庭成员身份证号',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_main_member_id (main_member_id),
  KEY idx_family_name (family_name),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='家庭表'

CREATE TABLE family_member (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '家庭-成员关联id',
  family_id bigint(20) NOT NULL COMMENT '家庭id',
  student_id bigint(20) NOT NULL COMMENT '学员id',
  is_main int(11) NOT NULL DEFAULT '0' COMMENT '是否是主要成员 0 否 1 是',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入学时间',
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_family_id (family_id),
  KEY idx_student_id (student_id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='家庭成员表'


-- 消费记录表
CREATE TABLE family_cost_record (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '家庭支付记录id',
  family_id bigint(20) NOT NULL COMMENT '家庭id',
  student_id bigint(20) NOT NULL COMMENT '学员id',
  cost decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '消费金额',
  consume_detail varchar(100) NOT NULL COMMENT '消费详情',
  is_member int(11) NOT NULL DEFAULT '0' COMMENT '是否会员 0 否 1 是',
  discount decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
  origin_price decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应收价格',
  consume_num int(11) NOT NULL DEFAULT '0' COMMENT '消费数量',
  actual_price decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实收价格',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消费时间',
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  KEY idx_family_id (family_id),
  KEY idx_student_id (student_id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='家庭费用记录表'

CREATE TABLE teacher (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '教师id',
  tea_name varchar(50) NOT NULL COMMENT '教师姓名',
  birth_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '教师生日',
  age int(11) NOT NULL COMMENT '教师年龄',
  phone_number varchar(100) NOT NULL COMMENT '联系方式，用英文逗号隔开',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  id_card varchar(20) NOT NULL,
  sex int(11) DEFAULT '1' COMMENT '1：男  2：女',
  course_id bigint(20) NOT NULL COMMENT '任职课程',
  PRIMARY KEY (id),
  KEY idx_tea_name (tea_name),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)  DEFAULT CHARSET=utf8mb4 COMMENT='教师表'

CREATE TABLE course (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '课程id',
  name varchar(50) NOT NULL COMMENT '课程名字',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='课程表'

CREATE TABLE course_grade (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '级别id',
  course_id bigint(20) NOT NULL COMMENT '课程id',
  name varchar(50) NOT NULL COMMENT '级别名字',
  course_semester int(11) NOT NULL COMMENT '课程学期 1 春季 2 暑期 3 秋季 4 寒假',
  course_origin_price decimal(10,2) NOT NULL COMMENT '原始课程价格',
  each_course_price decimal(10,2) NOT NULL COMMENT '课程单价',
  course_count int(11) NOT NULL COMMENT '课程时数',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='课程级别表'

CREATE TABLE class (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '班级id',
  course_id bigint(20) NOT NULL COMMENT '课程id',
  grade_id bigint(20) NOT NULL COMMENT '级别id',
  course_semester int(11) NOT NULL COMMENT '课程学期 1 春季 2 暑期 3 秋季 4 寒假',
  name varchar(50) NOT NULL COMMENT '班级名字',
  attend_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上课时间',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)  DEFAULT CHARSET=utf8mb4 COMMENT='班级表'

CREATE TABLE student_class (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  student_id bigint(20) NOT NULL COMMENT '学生id',
  class_id bigint(20) NOT NULL COMMENT '班级id',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='学生关联班级'

CREATE TABLE student_pay_class_record (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '学生支付课程记录id',
  student_id bigint(20) NOT NULL COMMENT '学员id',
  total_payment bigint(20) NOT NULL DEFAULT '0' COMMENT '总支付金额',
  student_class_id bigint(20) NOT NULL COMMENT '学生关联班级id',
  paid_course_count int(11) NOT NULL DEFAULT '0' COMMENT '购买课程次数',
  payment decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实际缴费金额',
  origin_price decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '每节课的原单价',
  real_price decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实际单价',
  remain_course_count int(11) NOT NULL DEFAULT '0' COMMENT '剩余课程次数',
  remain_cost decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '剩余课销金额',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_student_class_id (student_class_id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='学生购买班级课程记录'
    -- remain_course_count int                               not null comment '剩余课程次数',
    -- record_status       int                               not null default 1 comment '1 购买成功 2 已完结',
    -- member              int                               not null default 0 comment '0 非会员 1会员',
    -- origin_price        decimal(10, 2)                    not null comment '原单价',



CREATE TABLE student_attend_course_record (
  id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '学生上课时间记录id',
  student_class_id bigint(20) NOT NULL COMMENT '学生关联班级id',
  student_id bigint(20) NOT NULL COMMENT '学生id',
  class_id bigint(20) NOT NULL COMMENT '班级id',
  attend_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '上课时间',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_student_class_id (student_class_id),
  KEY idx_student_id (student_id),
  KEY idx_class_id (class_id),
  KEY idx_attend_date (attend_date),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)   DEFAULT CHARSET=utf8mb4 COMMENT='学生上课记录'



CREATE TABLE teacher_class (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  teacher_id bigint(20) NOT NULL COMMENT '教师id',
  class_id bigint(20) NOT NULL COMMENT '班级id',
  total_course_count int(11) NOT NULL DEFAULT '0' COMMENT '总的课程次数',
  remain_course_count int(11) NOT NULL DEFAULT '0' COMMENT '剩余课程次数',
  init_student_count int(11) NOT NULL DEFAULT '0' COMMENT '初始学生数量',
  curr_student_count int(11) NOT NULL DEFAULT '0' COMMENT '当前学生数量',
  status int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  create_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  KEY idx_create_ts (create_ts),
  KEY idx_update_ts (update_ts)
)  DEFAULT CHARSET=utf8mb4 COMMENT='老师关联班级'

select *
from teacher_class tc
         join class c on tc.class_id = c.id
         join student_class sc on c.id = sc.class_id