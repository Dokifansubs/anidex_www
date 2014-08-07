CREATE DATABASE  IF NOT EXISTS `nodetracker` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `nodetracker`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: 192.168.2.29    Database: nodetracker
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_categories`
--

DROP TABLE IF EXISTS `ai_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_categories`
--

LOCK TABLES `ai_categories` WRITE;
/*!40000 ALTER TABLE `ai_categories` DISABLE KEYS */;
INSERT INTO `ai_categories` VALUES (1,'Anime'),(2,'Drama'),(3,'Hentai');
/*!40000 ALTER TABLE `ai_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_groups`
--

DROP TABLE IF EXISTS `ai_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_groups` (
  `group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(32) NOT NULL,
  `leader_id` int(10) unsigned NOT NULL,
  `founded_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` varchar(8) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_groups`
--

LOCK TABLES `ai_groups` WRITE;
/*!40000 ALTER TABLE `ai_groups` DISABLE KEYS */;
INSERT INTO `ai_groups` VALUES (1,'Doki Fansubs','Doki',1,'2014-08-01 07:03:08','English');
/*!40000 ALTER TABLE `ai_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_sessions`
--

DROP TABLE IF EXISTS `ai_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_key` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_sessions`
--

LOCK TABLES `ai_sessions` WRITE;
/*!40000 ALTER TABLE `ai_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_torrent_comments`
--

DROP TABLE IF EXISTS `ai_torrent_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_torrent_comments` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `torrent_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_torrent_comments`
--

LOCK TABLES `ai_torrent_comments` WRITE;
/*!40000 ALTER TABLE `ai_torrent_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_torrent_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_users`
--

DROP TABLE IF EXISTS `ai_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `last_seen_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `join_timestamp` datetime NOT NULL,
  `login_attempts` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_users`
--

LOCK TABLES `ai_users` WRITE;
/*!40000 ALTER TABLE `ai_users` DISABLE KEYS */;
INSERT INTO `ai_users` VALUES (1,'Holo','a','a','2014-08-01 07:07:35','2014-08-07 00:00:00',0);
/*!40000 ALTER TABLE `ai_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peers`
--

DROP TABLE IF EXISTS `peers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peers` (
  `id` varchar(80) COLLATE latin1_general_ci NOT NULL,
  `peer_id` varchar(40) COLLATE latin1_general_ci NOT NULL,
  `info_hash` varchar(40) COLLATE latin1_general_ci NOT NULL,
  `ip` varchar(45) COLLATE latin1_general_ci NOT NULL,
  `port` int(5) unsigned NOT NULL,
  `uploaded` int(11) unsigned NOT NULL DEFAULT '0',
  `downloaded` int(11) unsigned NOT NULL DEFAULT '0',
  `left` int(11) unsigned NOT NULL DEFAULT '0',
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peers`
--

LOCK TABLES `peers` WRITE;
/*!40000 ALTER TABLE `peers` DISABLE KEYS */;
/*!40000 ALTER TABLE `peers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `torrent`
--

DROP TABLE IF EXISTS `torrent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `torrent` (
  `torrent_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `info_hash` varchar(40) COLLATE latin1_general_ci NOT NULL,
  `complete` int(11) unsigned NOT NULL DEFAULT '0',
  `incomplete` int(11) unsigned NOT NULL DEFAULT '0',
  `downloaded` int(11) unsigned NOT NULL DEFAULT '0',
  `category_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `group_id` int(11) unsigned DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `filename` varchar(255) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8,
  `size` bigint(20) unsigned NOT NULL,
  `comments` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`torrent_id`),
  UNIQUE KEY `info_hash_UNIQUE` (`info_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `torrent`
--

LOCK TABLES `torrent` WRITE;
/*!40000 ALTER TABLE `torrent` DISABLE KEYS */;
INSERT INTO `torrent` VALUES (4,'1defea192aac88bd8f474a964550920da25fb94c',0,0,0,1,1,1,'2014-08-06 23:00:00','[Doki] Yama no Susume Second Season - 04 (1280x720 Hi10P AAC) [C9CFCDCD].mkv',NULL,282997260,0),(5,'57e19f1c4c647cd0bc4f634fbc397cade8c91f69',0,0,0,1,1,NULL,'2014-08-07 10:00:15','[Doki] Himegoto - 05 (1280x720 Hi10P AAC) [50D94778].mkv',NULL,69530619,0);
/*!40000 ALTER TABLE `torrent` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-08-07 12:00:06
