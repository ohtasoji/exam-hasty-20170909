DROP DATABASE IF EXISTS `created_at`

CREATE TABLE created_at (
         `id` INT(11),
         `creation_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
         `modification_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         PRIMARY KEY (id)
       );
insert into foo (id) VALUES (1);