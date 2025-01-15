-- Main database
CREATE DATABASE IF NOT EXISTS `memory_game_webdev_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

-- Use the main database
USE `memory_game_webdev_db`;

-- memory_game_webdev_db.Scores definition
CREATE TABLE `Scores` (
  `user_id` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`entry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Test database
CREATE DATABASE IF NOT EXISTS `memory_game_webdev_db_test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

-- Use the test database
USE `memory_game_webdev_db_test`;

-- memory_game_webdev_db_test.Scores definition
CREATE TABLE `Scores` (
  `user_id` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`entry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
