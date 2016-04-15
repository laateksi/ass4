CREATE DATABASE  IF NOT EXISTS `warehouse_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `warehouse_db`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: warehouse_db
-- ------------------------------------------------------
-- Server version	5.7.11-log

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
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materials` (
  `material_id` varchar(45) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `supplier` varchar(45) DEFAULT NULL,
  `arrival_date` date DEFAULT NULL,
  `assigned` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('0',NULL,NULL,NULL,NULL,NULL,'de34a46e-8b2f-4db3-8802-a7246a74911f'),('1','wood','pine',50,'Timber Oy','2078-06-20','11'),('22c217dc-6391-4560-bba1-f32cf5e469a1','juusto','wood',55,'liisa','2056-05-04',NULL),('4','PUU','KIVI',45,'KALLE','2015-09-20',NULL),('5','resouces','toxic waste',4,'Loreal','2016-06-20','12'),('689261ea-5959-4415-bc93-092a9cf15b7e','heavy','metal',666,'ossi','2004-04-20',NULL),('78','PUU','KIVI',45,'KALLE','2015-09-20','12'),('99','juusto','leipa',55,'liisa','2056-05-04','11'),('999','juusto','wood',55,'liisa','2056-05-04','12'),('cc5b33c5-9fb7-426d-912b-54ae6073b079','heavy','metal',666,'ossi','2004-04-20',NULL),('d529e288-1376-41dd-8712-a556d756caba','heavy','metal',666,'ossi','2004-04-20',NULL),('e56125b8-a6a3-483b-99ee-32b0ecf868c5','heavy','metal',666,'ossi','2004-04-20','12');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_id` varchar(45) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `customer` varchar(45) DEFAULT NULL,
  `arrival_date` date DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('11','drugs','codeiini',2,'addict','2016-11-06'),('12','tools','bomb',1,'terrorist','2016-06-10'),('45',NULL,NULL,500,'nahlle',NULL),('495',NULL,'kakka',500,'nahlle',NULL),('745',NULL,NULL,500,'nahlle',NULL),('de34a46e-8b2f-4db3-8802-a7246a74911f','eläin','kani',33,'marko','2019-07-08');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-15 21:54:28
