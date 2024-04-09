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
    id           bigint primary key auto_increment not null comment '',
    birth_date   timestamp                         not null comment '生日',
    phone_number varchar(100)                      not null comment '联系方式，用英文逗号隔开',
    stu_name     varchar(50)                       not null comment '学生姓名',
    id_card      varchar(20)                       null comment '身份证号',
    status       int                               not null default 1 comment '1 有效 99 删除',
    sex          int                               not null default 1 comment '1 男 2 女',
    create_ts    timestamp                         not null default current_timestamp,
    update_ts    timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_stu_name (stu_name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '学员表';

create table teacher
(
    id           bigint primary key auto_increment not null comment '',
    admin_id     bigint                            null comment '',
    account      varchar(30)                       null comment '',
    `password`   varchar(30)                       null comment '',
    birth_date   timestamp                         not null comment '',
    age          int                               not null,
    phone_number varchar(100)                      not null comment '联系方式，用英文逗号隔开',
    tea_name     varchar(50)                       not null comment '学生姓名',
    status       int                               not null default 1 comment '1 有效 99 删除',
    create_ts    timestamp                         not null default current_timestamp,
    update_ts    timestamp                         not null default current_timestamp on update current_timestamp,
    unique idx_account (account),
    index idx_tea_name (tea_name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '教师表';

create table course
(
    id        bigint primary key auto_increment not null comment '',
    name      varchar(50)                       not null comment '课程名字',
    status    int                               not null default 1 comment '1 有效 99 删除',
    create_ts timestamp                         not null default current_timestamp,
    update_ts timestamp                         not null default current_timestamp on update current_timestamp,
    unique uniq_name (name),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '课程表';

create table course_grade
(
    id        bigint primary key auto_increment not null comment '',
    course_id bigint                            not null comment '课程id',
    grade     int                               not null comment '级别',
    name      varchar(50)                       not null comment '级别名字',
    status    int                               not null default 1 comment '1 有效 99 删除',
    create_ts timestamp                         not null default current_timestamp,
    update_ts timestamp                         not null default current_timestamp on update current_timestamp,
    unique uniq_course_grade (course_id, grade),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '课程级别表';

create table class
(
    id        bigint primary key auto_increment not null comment '',
    grade_id  bigint                            not null comment '课程id',
    name      varchar(50)                       not null comment '班级名字',
    status    int                               not null default 1 comment '1 有效 99 删除',
    create_ts timestamp                         not null default current_timestamp,
    update_ts timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '班级表';

create table student_class
(
    id                  bigint primary key auto_increment not null comment '',
    student_id          bigint                            not null comment '学生id',
    class_id            bigint                            not null comment 'class#id',
    total_course_count  int                               not null comment '总的课程次数',
    remain_course_count int                               not null comment '剩余课程次数',
    status              int                               not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                         not null default current_timestamp,
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '学生关联班级';

create table student_pay_class_record
(
    id                  bigint primary key auto_increment not null comment '',
    student_class_id    bigint                            not null comment '',
    student_id          bigint                            not null comment '学生id',
    class_id            bigint                            not null comment 'class#id',
    member              int                               not null default 0 comment '0 非会员 1会员',
    payment             decimal(10, 2)                    not null comment '缴费金额=real_price*paid_course_count',
    origin_price        decimal(10, 2)                    not null comment '原单价',
    real_price          decimal(10, 2)                    not null comment '实际单价',
    paid_course_count   int                               not null comment '购买课程次数',
    remain_course_count int                               not null comment '剩余课程次数',
    record_status       int                               not null default 1 comment '1 购买成功 2 已完结',
    status              int                               not null default 1 comment '1 有效 99 删除',
    create_ts           timestamp                         not null default current_timestamp,
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_student_class_id (student_class_id),
    index idx_student_id (student_id),
    index idx_class_id (class_id),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '学生购买班级课程记录';


create table student_attend_course_record
(
    id               bigint primary key auto_increment not null comment '',
    student_class_id bigint                            not null comment '',
    student_id       bigint                            not null comment '学生id',
    class_id         bigint                            not null comment 'class#id',
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
) comment '学生上课记录';



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
    update_ts           timestamp                         not null default current_timestamp on update current_timestamp,
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
) comment '老师关联班级';

select *
from teacher_class tc
         join class c on tc.class_id = c.id
         join student_class sc on c.id = sc.class_id