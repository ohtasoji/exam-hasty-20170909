DROP TABLE IF EXISTS `users`;

CREATE TABLE `users`(
  `id` INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(120) NOT NULL,
  UNIQUE KEY `idx_nickname`(`nickname`),
  `salt` VARCHAR(255) NOT NULL,-- カラムの追加
  UNIQUE KEY `uk_email`(`email`)
);

