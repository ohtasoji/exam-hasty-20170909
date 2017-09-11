DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles`(
  `id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT,
  `created_at` DATETIME,
  `updated_at` DATETIME
);