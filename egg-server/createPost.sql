 create table `posts` (
   `id` varchar(40) not null comment 'id',
   `title` VARCHAR(100) not null comment '标题',
   `intro` varchar(200) not null comment '简介',
   `content` TEXT not null comment '内容',
   `category` varchar(40) comment '分类id',
   `img` varchar(1000) comment '首图',
   `tag` varchar(1000) comment '标签ids',
   `created_at` datetime DEFAULT NULL COMMENT 'created time',
   `updated_at` datetime DEFAULT NULL COMMENT 'updated time',
   primary key (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章';