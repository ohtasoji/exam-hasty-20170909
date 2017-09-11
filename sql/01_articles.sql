CREATE TABLE `articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT
  `create_at` SELECT date FROM ?
  `update_at` SELECT date FROM ?
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
