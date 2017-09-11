mysql> CREATE TABLE `articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
