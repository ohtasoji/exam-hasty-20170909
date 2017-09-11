CREATE TABLE `articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  -- 記事のタイトル
  `title` VARCHAR(255) NOT NULL,
  -- 記事の中身
  `body` TEXT,
  -- 記事が作られた時間
  `created_at` DATE TIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
