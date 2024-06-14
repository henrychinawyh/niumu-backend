create table admin
    (
    id         bigint primary key auto_increment not null comment '',
    account    varchar(30)                       not null comment '账号',
    password varchar(30)                         not null comment '账号密码',
    admin_type int                               not null default 2 comment '1 超级管理员 2 普通管理员',
    status     int                               not null default 1 comment '1 有效 99 删除',
    create_ts  timestamp                         not null default current_timestamp,
    update_ts  timestamp                         not null default current_timestamp on update current_timestamp,
    unique idx_account (account),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
    );

create table student
(
    id           bigint primary key auto_increment not null comment '学员id',
    birth_date   timestamp                         not null comment '生日',
    phone_number varchar(100)                      not null comment '联系方式，用英文逗号隔开',
    has_cousin   varchar(20)                       comment '是否有兄弟姐妹，用英文逗号隔开 0 姐姐 1 妹妹 2 哥哥 3 弟弟',
    school_name  varchar(50)                       comment '就读学校',
    stu_name     varchar(50)                       not null comment '学生姓名',
    id_card      varchar(20)                       not null comment '身份证号',
    status       int                               not null default 1 comment '1 有效 99 删除',
    sex          int                               not null default 1 comment '1 男 2 女',
    create_ts    timestamp                         not null default current_timestamp,
    update_ts    timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_stu_name (stu_name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '学员表';

create table family (
    id              bigint primary key auto_increment  not null comment '家庭id',
    family_name     varchar(20)                        not null comment '家庭名字', 
    is_member       int                                not null default 0 comment '是否是会员 0 否 1 是',
    discount        decimal(10, 2)                     not null default 0 comment '折扣',
    account_balance decimal(10, 2)                     not null default 0 comment '账户余额',
    main_member_id  varchar(20)                        not null comment '主要家庭成员身份证号',
    status          int                                not null default 1 comment '1 有效 99 删除',
    create_ts       timestamp                          not null default current_timestamp,
    update_ts       timestamp                          not null default current_timestamp on update current_timestamp,
    unique idx_main_member_id (main_member_id),
    index idx_family_name (family_name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '家庭表'

create table family_member (
    id              bigint primary key auto_increment  not null comment '家庭-成员关联id',
    family_id       bigint                             not null comment '家庭id',
    student_id      bigint                             not null comment '学员id',
    is_main         int                                not null default 0 comment '是否是主要成员 0 否 1 是',
    status          int                                not null default 1 comment '1 有效 99 删除',
    create_ts       timestamp                          not null default current_timestamp comment '入学时间',
    update_ts       timestamp                          not null default current_timestamp on update current_timestamp,
    index idx_family_id (family_id),
    index idx_student_id (student_id),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '家庭成员表'


create table family_cost_record (
    id              bigint primary key auto_increment  not null comment '家庭支付记录id',
    family_id       bigint                             not null comment '家庭id',
    student_id      bigint                             not null comment '学员id',
    cost            decimal(10, 2)                     not null comment '消费金额',
    consume_detail  varchar(100)                       not null comment '消费详情',  
    is_discount     int                                not null default 0 comment '是否折扣 0 否 1 是',
    discount        decimal(10, 2)                     not null default 0 comment '折扣',
    origin_price    decimal(10, 2)                     not null comment '应收价格',
    actual_price    decimal(10, 2)                     not null comment '实收价格',
    status          int                                not null default 1 comment '1 有效 99 删除',
    create_ts       timestamp                          not null default current_timestamp comment '消费时间',
    update_ts       timestamp                          not null default current_timestamp on update current_timestamp,
    index idx_family_id (family_id),
    index idx_student_id (student_id),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '家庭费用记录表'

create table teacher
(
    id           bigint primary key auto_increment not null comment '教师id',
    tea_name     varchar(50)                       not null comment '教师姓名',
    birth_date   timestamp                         not null comment '教师生日',
    age          int                               not null comment '教师年龄',
    phone_number varchar(100)                      not null comment '联系方式，用英文逗号隔开',
    status       int                               not null default 1 comment '1 有效 99 删除',
    create_ts    timestamp                         not null default current_timestamp comment '创建时间', 
    update_ts    timestamp                         not null default current_timestamp on update current_timestamp comment '更新时间',
    index idx_tea_name (tea_name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '教师表';

create table course
(
    id        bigint primary key auto_increment not null comment '课程id',
    name      varchar(50)                       not null comment '课程名字',
    status    int                               not null default 1 comment '1 有效 99 删除',
    create_ts timestamp                         not null default current_timestamp,
    update_ts timestamp                         not null default current_timestamp on update current_timestamp,
    unique uniq_name (name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '课程表';

create table course_grade
(
    id                  bigint primary key auto_increment   not null comment '级别id',
    course_id           bigint                              not null comment '课程id',
    name                varchar(50)                         not null comment '级别名字',
    course_semester     int                                 not null comment '课程学期 1 春季 2 暑期 3 秋季 4 寒假',
    course_origin_price decimal(10, 2)                      not null comment '原始课程价格',
    each_course_price   decimal(10, 2)                      not null comment '课程单价',
    course_count        int                                 not null comment '课程时数',
    status              int                                 not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                           not null default current_timestamp,
    update_ts           timestamp                           not null default current_timestamp on update current_timestamp,
    unique uniq_course_grade (course_id, grade),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '课程级别表';

create table class
(
    id                 bigint primary key auto_increment not null comment '班级id',
    course_id          bigint                            not null comment '课程id',
    grade_id           bigint                            not null comment '级别id',
    course_semester    int                               not null comment '课程学期 1 春季 2 暑期 3 秋季 4 寒假',
    name               varchar(50)                       not null comment '班级名字',
    status             int                               not null default 1 comment '1 有效 99 删除',
    create_ts          timestamp                         not null default current_timestamp,
    update_ts          timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '班级表';

create table student_class
(
    id                  bigint primary key auto_increment not null comment '学员关联班级id',
    student_id          bigint                            not null comment '学生id',
    class_id            bigint                            not null comment '班级id',
    status              int                               not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                         not null default current_timestamp,
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '学生关联班级';

create table student_pay_class_record
(
    id                  bigint primary key auto_increment not null comment '学生支付课程记录id',
    student_class_id    bigint                            not null comment '学生关联班级id',
    paid_course_count   int                               not null comment '购买课程次数',
    payment             decimal(10, 2)                    not null comment '缴费金额',
    real_price          decimal(10, 2)                    not null comment '实际单价',
    remain_course_count int                               not null comment '剩余课程次数',
    remain_cost         decimal(10, 2)                    not null comment '剩余课销金额'
    status              int                               not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                         not null default current_timestamp,
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_student_class_id (student_class_id),
    index idx_student_id (student_id),
    index idx_class_id (class_id),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '学生购买班级课程记录';
    -- remain_course_count int                               not null comment '剩余课程次数',
    -- record_status       int                               not null default 1 comment '1 购买成功 2 已完结',
    -- member              int                               not null default 0 comment '0 非会员 1会员',
    -- origin_price        decimal(10, 2)                    not null comment '原单价',



create table student_attend_course_record
(
    id               bigint primary key auto_increment not null comment '学生上课时间记录id',
    student_class_id bigint                            not null comment '学生关联班级id',
    student_id       bigint                            not null comment '学生id',
    class_id         bigint                            not null comment '班级id',
    attend_date      date                              not null comment '上课时间',
    status           int                               not null default 1 comment '1 有效 99 删除',
    create_ts        timestamp                         not null default current_timestamp,
    update_ts        timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_student_class_id (student_class_id),
    index idx_student_id (student_id),
    index idx_class_id (class_id),
    index idx_attend_date (attend_date),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '学生上课记录';



create table teacher_class
(
    id                  bigint primary key auto_increment not null comment '',
    teacher_id          bigint                            not null comment 'teacher#id',
    class_id            bigint                            not null comment 'class#id',
    total_course_count  int                               not null comment '总的课程次数',
    remain_course_count int                               not null comment '剩余课程次数',
    init_student_count  int                               not null default 0 comment '初始学生数量',
    curr_student_count  int                               not null default 0 comment '当前学生数量',
    status              int                               not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                         not null default current_timestamp,
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp comment '更新时间',
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) DEFAULT CHARSET=utf8mb4 comment '老师关联班级';

select *
from teacher_class tc
         join class c on tc.class_id = c.id
         join student_class sc on c.id = sc.class_id