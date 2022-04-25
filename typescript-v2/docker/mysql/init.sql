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
	`id`,
	`title`,
  `description`
) VALUES
	(1, '米を炊く', 'スーパーで買う'),
	(2, '風呂を沸かす', '19:00にお風呂のスイッチ入れる'),
	(3, '飲み会に行く', '21:00にZoomにログインする'),
	(4, '買い物に行く', '19:00にパンを買う'),
	(5, 'バスケをする', '24:00に市民体育館でバスケをする')
;