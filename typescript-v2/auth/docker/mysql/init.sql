-- users
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (
	`name`,
  `email`,
  `password`
) VALUES
	('田中太郎', 'tarou@example.com', 'password'),
	('山田花子', 'hanako@example.com', 'password')
;

-- todos
CREATE TABLE `todos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL DEFAULT '',
  `description` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `todos` (
	`title`,
  `description`
) VALUES
	('米を炊く', 'スーパーで買う'),
	('風呂を沸かす', '19:00にお風呂のスイッチ入れる'),
	('飲み会に行く', '21:00にZoomにログインする'),
	('買い物に行く', '19:00にパンを買う'),
	('バスケをする', '24:00に市民体育館でバスケをする')
;