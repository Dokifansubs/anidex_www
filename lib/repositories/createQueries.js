exports.torrent = function() {
    var query = "CREATE TABLE IF NOT EXISTS `torrent` (";
    query += "`torrent_id` int(11) unsigned NOT NULL AUTO_INCREMENT,";
    query += "`info_hash` varchar(40) COLLATE latin1_general_ci NOT NULL,";
    query += "`complete` int(11) unsigned NOT NULL DEFAULT '0',";
    query += "`incomplete` int(11) unsigned NOT NULL DEFAULT '0',";
    query += "`downloaded` int(11) unsigned NOT NULL DEFAULT '0',";
    query += "`category_id` int(11) unsigned NOT NULL,";
    query += "`user_id` int(11) unsigned NOT NULL,";
    query += "`group_id` int(11) unsigned NOT NULL DEFAULT '0',";
    query += "`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,";
    query += "`filename` varchar(255) CHARACTER SET utf8 NOT NULL,";
    query += "`description` text CHARACTER SET utf8,";
    query += "`size` bigint(20) unsigned NOT NULL,";
    query += "`comments` int(11) unsigned NOT NULL DEFAULT '0',";
    query += "PRIMARY KEY (`torrent_id`),";
    query += "UNIQUE KEY `info_hash_UNIQUE` (`info_hash`)";
    query += ") ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci";
    return query;
};

exports.sessions = function() {
    var query = "CREATE TABLE IF NOT EXISTS `sessions` (";
    query += "`session_id` varchar(255) COLLATE utf8_bin NOT NULL,";
    query += "`expires` int(11) unsigned NOT NULL,";
    query += "`data` text COLLATE utf8_bin,";
    query += "PRIMARY KEY (`session_id`)";
    query += ") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    return query;
};

exports.user_group = function() {
	 var query = "CREATE TABLE IF NOT EXISTS `user_group` (";
	 query += "`user_group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,";
	 query += "`user_id` int(10) unsigned NOT NULL,";
	 query += "`group_id` int(10) unsigned NOT NULL,";
    query += "PRIMARY KEY (`user_group_id`)";
    query += ") ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";
	 return query;
};

exports.peers = function() {
	 var query = "CREATE TABLE IF NOT EXISTS `peers` (";
	 query += "`id` varchar(80) COLLATE latin1_general_ci NOT NULL,";
	 query += "`peer_id` varchar(40) COLLATE latin1_general_ci NOT NULL,";
	 query += "`info_hash` varchar(40) COLLATE latin1_general_ci NOT NULL,";
	 query += "`ip` varchar(45) COLLATE latin1_general_ci DEFAULT NULL,";
	 query += "`ipv6` varchar(45) COLLATE latin1_general_ci DEFAULT NULL,";
	 query += "`port` int(5) unsigned NOT NULL,";
	 query += "`uploaded` int(11) unsigned NOT NULL DEFAULT '0',";
	 query += "`downloaded` int(11) unsigned NOT NULL DEFAULT '0',";
	 query += "`left` int(11) unsigned NOT NULL DEFAULT '0',";
	 query += "`last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,";
	 query += "PRIMARY KEY (`id`)";
	 query += ") ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci";
	 return query;
};

exports.users = function() {
	 var query = "CREATE TABLE IF NOT EXISTS `ai_users` (";
	 query += "`user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,";
	 query += "`username` varchar(32) NOT NULL,";
	 query += "`password` varchar(128) NOT NULL,";
	 query += "`email` varchar(128) NOT NULL,";
	 query += "`ident_hash` varchar(128) DEFAULT NULL,";
	 query += "`last_seen_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,";
	 query += "`join_timestamp` datetime NOT NULL,";
	 query += "`login_attempts` tinyint(3) unsigned NOT NULL DEFAULT '0',";
	 query += "`verified` tinyint(1) unsigned NOT NULL DEFAULT '0',";
	 query += "PRIMARY KEY (`user_id`)";
	 query += ") ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8";
	 return query;
};

exports.categories = function() {
	 var query = "CREATE TABLE IF NOT EXISTS `ai_categories` (";
	 query += "`category_id` int(11) NOT NULL AUTO_INCREMENT,";
	 query += "`category_name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,";
	 query += "PRIMARY KEY (`category_id`),";
	 query += "UNIQUE KEY `category_name_UNIQUE` (`category_name`)";
	 query += ") ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci";
	 return query; 
};

exports.groups = function() {
	 var query = "CREATE TABLE IF NOT EXISTS `ai_groups` (";
	 query += "`group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,";
	 query += "`name` varchar(64) NOT NULL,";
	 query += "`short_name` varchar(32) NOT NULL,";
	 query += "`leader_id` int(10) unsigned NOT NULL,";
	 query += "`founded_timestamp` date NOT NULL,";
	 query += "`language` varchar(8) NOT NULL,";
	 query += "`website` varchar(32) NOT NULL,";
	 query += "`irc_channel` varchar(16) NOT NULL,";
	 query += "`irc_server` varchar(16) NOT NULL DEFAULT 'irc.rizon.net',";
	 query += "`contact` varchar(64) NOT NULL,";
	 query += "`banner` varchar(64) NOT NULL DEFAULT 'http://uploads.ninja/uploads/9cd53.jpg',";
	 query += "`description` text NOT NULL,";
	 query += "PRIMARY KEY (`group_id`)";
	 query += ") ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8";
	 return query;
};