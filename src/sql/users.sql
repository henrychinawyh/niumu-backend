create table admin
(
    id         bigint primary key auto_increment not null comment '',
    account    varchar(30)                       not null comment '账号',
    `password` varchar(30)                       not null comment '账号密码',
    admin_type int                               not null default 2 comment '1 超级管理员 2 普通管理员',
    status     int                               not null default 1 comment '1 有效 99 删除',
    create_ts  timestamp                         not null default current_timestamp,
    update_ts  timestamp                         not null default current_timestamp on update current_timestamp,
    unique idx_account (account),
    index idx_create_ts (create_ts),
    index idx_update_ts (update_ts)
);