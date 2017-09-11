CREATE TABLE `articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT
  `create_at` TIMESTAMP
  `update_at` TIMESTAMP UPDATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
