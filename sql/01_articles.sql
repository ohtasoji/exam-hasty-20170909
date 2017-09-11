DROP TABLE IF EXISTS `articles` ;

CREATE TABLE `articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT,
  `created_at` DATETIME ,
  `updated_at` DATETIME 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER
        articles_insert_trigger
    BEFORE INSERT ON
        articles
    FOR EACH ROW
    SET
        new.created_at = CURRENT_TIMESTAMP;

CREATE TRIGGER
        articles_update_trigger
    BEFORE UPDATE ON
        articles
    FOR EACH ROW
    SET
        new.updated_at = CURRENT_TIMESTAMP;