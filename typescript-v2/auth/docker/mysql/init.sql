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
  `id`,
	`name`,
  `email`,
  `password`
) VALUES
	(1, '田中太郎', 'tarou@example.com', 'password'),
	(2, '山田花子', 'hanako@example.com', 'password')
;

-- todos
CREATE TABLE `todos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(50) NOT NULL DEFAULT '',
  `description` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `todos` (
  `user_id`,
	`title`,
  `description`
) VALUES
	(1, '米を炊く', 'スーパーで買う'),
	(1, '風呂を沸かす', '19:00にお風呂のスイッチ入れる'),
	(1, '飲み会に行く', '21:00にZoomにログインする'),
	(1, '買い物に行く', '19:00にパンを買う'),
	(1, 'バスケをする', '24:00に市民体育館でバスケをする')
;