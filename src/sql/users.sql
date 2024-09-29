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

CREATE TABLE admin (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_type` int(11) NOT NULL DEFAULT '2' COMMENT '1 超级管理员 2 普通管理员',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1 有效 99 删除',
  `create_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account` (`account`),
  KEY `idx_create_ts` (`create_ts`),
  KEY `idx_update_ts` (`update_ts`)
)  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci