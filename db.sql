-- MySQL dump 10.13  Distrib 8.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: extorris
-- ------------------------------------------------------
-- Server version	8.4.0
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8mb4 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_roles`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `admin_roles` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admin_roles_name` (`name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_sessions`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `admin_sessions` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `admin_id` int unsigned NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `token` varchar(255) NOT NULL,
    `expire` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admin_sessions_token` (`token`),
    KEY `admin_sessions_admins_FK` (`admin_id`),
    CONSTRAINT `admin_sessions_admins_FK` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admins`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `admins` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `role_id` int unsigned DEFAULT NULL,
    `username` varchar(100) NOT NULL,
    `email` varchar(100) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      `firstname` varchar(100) DEFAULT NULL,
      `surname` varchar(100) DEFAULT NULL,
      `password` varchar(100) NOT NULL,
      `created` datetime DEFAULT CURRENT_TIMESTAMP,
      `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      `login_attempts` int unsigned DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `admins_unique_username` (`username`),
      UNIQUE KEY `admins_unique_email` (`email`),
      KEY `admins_admin_roles_FK` (`role_id`),
      CONSTRAINT `admins_admin_roles_FK` FOREIGN KEY (`role_id`) REFERENCES `admin_roles` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_messages`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `chat_messages` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `chat_id` int unsigned NOT NULL,
    `user_id` int unsigned DEFAULT NULL,
    `message` text NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `chat_messages_chats_FK` (`chat_id`),
    KEY `chat_messages_users_FK` (`user_id`),
    CONSTRAINT `chat_messages_chats_FK` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`),
    CONSTRAINT `chat_messages_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_users`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `chat_users` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `chat_id` int unsigned NOT NULL,
    `user_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `chat_users_chats_FK` (`chat_id`),
    KEY `chat_users_users_FK` (`user_id`),
    CONSTRAINT `chat_users_chats_FK` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`),
    CONSTRAINT `chat_users_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chats`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `chats` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `guild_id` int unsigned DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `type` varchar(100) DEFAULT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `chats_guilds_FK` (`guild_id`),
    CONSTRAINT `chats_guilds_FK` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `config_dimensions`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `config_dimensions` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `value` float DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `config_dimensions_unique` (`name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `countries`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `countries` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `code` varchar(100) NOT NULL,
    `name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `countries_unique_code` (`code`),
    UNIQUE KEY `countries_unique_name` (`name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dungeon_islands`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `dungeon_islands` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `main_map_hub_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `dungeon_islands_users_FK` (`user_id`),
    KEY `dungeon_islands_main_map_hubs_FK` (`main_map_hub_id`),
    CONSTRAINT `dungeon_islands_main_map_hubs_FK` FOREIGN KEY (`main_map_hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `dungeon_islands_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `external_creature_species`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `external_creature_species` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name_id` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `external_creature_species_translations_FK` (`name_id`),
    CONSTRAINT `external_creature_species_translations_FK` FOREIGN KEY (`name_id`) REFERENCES `translations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `external_creatures`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `external_creatures` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `main_map_hub_id` int unsigned NOT NULL,
    `external_creature_species_id` int unsigned NOT NULL,
    `nest_id` int unsigned DEFAULT NULL,
    `level` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `external_creatures_main_map_hubs_FK` (`main_map_hub_id`),
    KEY `external_creatures_external_creature_species_FK` (`external_creature_species_id`),
    KEY `external_creatures_nests_FK` (`nest_id`),
    CONSTRAINT `external_creatures_external_creature_species_FK` FOREIGN KEY (`external_creature_species_id`) REFERENCES `external_creature_species` (`id`),
    CONSTRAINT `external_creatures_main_map_hubs_FK` FOREIGN KEY (`main_map_hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `external_creatures_nests_FK` FOREIGN KEY (`nest_id`) REFERENCES `nests` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guilds`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `guilds` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` text,
    `experience` int DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `guilds_unique_name` (`name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `images` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `relative_path` varchar(255) NOT NULL,
    `width` int unsigned DEFAULT NULL,
    `height` int unsigned DEFAULT NULL,
    `name` varchar(255) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      `is_temp` tinyint (1) DEFAULT '0',
      `size` int unsigned DEFAULT NULL,
      PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inland_creatures`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `inland_creatures` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iterations`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `iterations` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `start_date` datetime DEFAULT NULL,
    `end_date` datetime DEFAULT NULL,
    `active` tinyint (1) DEFAULT '0',
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `languages`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `languages` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `country_id` int unsigned NOT NULL,
    `code` varchar(100) NOT NULL,
    `name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `languages_unique_code` (`code`),
    UNIQUE KEY `languages_unique_name` (`name`),
    KEY `languages_countries_FK` (`country_id`),
    CONSTRAINT `languages_countries_FK` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `main_map_hubs`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `main_map_hubs` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `main_map_id` int unsigned NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `contamination_level` int unsigned DEFAULT NULL,
    `internal_depth` int unsigned DEFAULT NULL,
    `on_depth` int unsigned NOT NULL,
    `hub_number` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `main_map_hub_main_map_FK` (`main_map_id`),
    CONSTRAINT `main_map_hub_main_map_FK` FOREIGN KEY (`main_map_id`) REFERENCES `main_maps` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `main_maps`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `main_maps` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `iteration_id` int unsigned DEFAULT NULL,
    `layer` int unsigned NOT NULL DEFAULT '0',
    `map_depth` int unsigned NOT NULL,
    `hub_links_type` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `main_map_iteration_FK` (`iteration_id`),
    CONSTRAINT `main_map_iteration_FK` FOREIGN KEY (`iteration_id`) REFERENCES `iterations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nest_types`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `nest_types` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `external_creature_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `nest_type_external_creatures_FK` (`external_creature_id`),
    CONSTRAINT `nest_type_external_creatures_FK` FOREIGN KEY (`external_creature_id`) REFERENCES `external_creature_species` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nests`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `nests` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `tree_id` int unsigned NOT NULL,
    `nest_type_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `nests_trees_FK` (`tree_id`),
    KEY `nests_nest_types_FK` (`nest_type_id`),
    CONSTRAINT `nests_nest_types_FK` FOREIGN KEY (`nest_type_id`) REFERENCES `nest_types` (`id`),
    CONSTRAINT `nests_trees_FK` FOREIGN KEY (`tree_id`) REFERENCES `trees` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `portals`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `portals` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `from_hub_id` int unsigned NOT NULL,
    `to_hub_id` int unsigned NOT NULL,
    `from_hub_position_x` int NOT NULL,
    `from_hub_position_y` int NOT NULL,
    `to_hub_position_x` int NOT NULL,
    `to_hub_position_y` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `portals_main_map_hubs_FK` (`from_hub_id`),
    KEY `portals_main_map_hubs_FK_1` (`to_hub_id`),
    CONSTRAINT `portals_main_map_hubs_FK` FOREIGN KEY (`from_hub_id`) REFERENCES `main_map_hubs` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `portals_main_map_hubs_FK_1` FOREIGN KEY (`to_hub_id`) REFERENCES `main_map_hubs` (`id`) ON DELETE RESTRICT
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rtcalc_instances`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `rtcalc_instances` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `uuid` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rtcalc_instances_unique_uuid` (`uuid`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rtcalc_instances_hubs`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `rtcalc_instances_hubs` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `rtcalc_instance_id` int unsigned NOT NULL,
    `main_map_hub_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rtcalc_instances_hubs_unique_hub_id` (`main_map_hub_id`),
    KEY `rtcalc_instances_hubs_rtcalc_instances_FK` (`rtcalc_instance_id`),
    CONSTRAINT `rtcalc_instances_hubs_main_map_hubs_FK` FOREIGN KEY (`main_map_hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `rtcalc_instances_hubs_rtcalc_instances_FK` FOREIGN KEY (`rtcalc_instance_id`) REFERENCES `rtcalc_instances` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_armors`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_armors` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) DEFAULT NULL,
    `defense` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_armors_users_FK` (`user_id`),
    KEY `ship_armors_ships_FK` (`ship_id`),
    CONSTRAINT `ship_armors_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `ship_armors_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_cannons`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_cannons` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) DEFAULT NULL,
    `attack_power` int unsigned DEFAULT NULL,
    `energy_consumption_per_action` int unsigned DEFAULT NULL,
    `action_cooldown` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_cannons_users_FK` (`user_id`),
    KEY `ship_cannons_ships_FK` (`ship_id`),
    CONSTRAINT `ship_cannons_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `ship_cannons_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_energy_cores`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_energy_cores` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) DEFAULT NULL,
    `energy_capacity` int unsigned NOT NULL,
    `energy_production` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_energy_core_users_FK` (`user_id`),
    KEY `ship_energy_core_ships_FK` (`ship_id`),
    CONSTRAINT `ship_energy_core_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `ship_energy_core_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_engines`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_engines` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) DEFAULT NULL,
    `max_speed` int unsigned DEFAULT NULL,
    `acceleration` int unsigned DEFAULT NULL,
    `energy_consumption` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_engines_users_FK` (`user_id`),
    KEY `ship_engines_ships_FK` (`ship_id`),
    CONSTRAINT `ship_engines_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `ship_engines_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_hulls`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_hulls` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) DEFAULT NULL,
    `energy_consumption_factor` float DEFAULT NULL,
    `maximum_crew` int unsigned DEFAULT NULL,
    `speed_factor` float DEFAULT NULL,
    `health_points` int unsigned DEFAULT NULL,
    `cannon_slots` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_hulls_users_FK` (`user_id`),
    KEY `ship_hulls_ships_FK` (`ship_id`),
    CONSTRAINT `ship_hulls_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `ship_hulls_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_module_types`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_module_types` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name_id` int unsigned NOT NULL,
    `code_name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_module_types_translations_FK` (`name_id`),
    CONSTRAINT `ship_module_types_translations_FK` FOREIGN KEY (`name_id`) REFERENCES `translations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_part_subtypes`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_part_subtypes` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name_id` int unsigned DEFAULT NULL,
    `code_name` varchar(255) NOT NULL,
    `image_id` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_part_subtypes_translations_FK` (`name_id`),
    KEY `ship_part_subtypes_images_FK` (`image_id`),
    CONSTRAINT `ship_part_subtypes_images_FK` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`),
    CONSTRAINT `ship_part_subtypes_translations_FK` FOREIGN KEY (`name_id`) REFERENCES `translations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ship_part_types`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ship_part_types` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name_id` int unsigned DEFAULT NULL,
    `code_name` varchar(100) NOT NULL,
    `speed_change` int DEFAULT '0',
    `physical_defense_change` int DEFAULT '0',
    `maximum_crew_change` int DEFAULT '0',
    `max_weight_change` int DEFAULT '0',
    `attack_power_change` int DEFAULT '0',
    `energy_consumption_change` int DEFAULT '0',
    `subtype_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ship_part_types_translations_FK` (`name_id`),
    KEY `ship_part_types_ship_part_subtypes_FK` (`subtype_id`),
    CONSTRAINT `ship_part_types_ship_part_subtypes_FK` FOREIGN KEY (`subtype_id`) REFERENCES `ship_part_subtypes` (`id`),
    CONSTRAINT `ship_part_types_translations_FK` FOREIGN KEY (`name_id`) REFERENCES `translations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ships`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ships` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned DEFAULT NULL,
    `main_map_hub_id` int unsigned DEFAULT NULL,
    `is_parked` tinyint (1) DEFAULT NULL,
    `name` varchar(100) NOT NULL,
    `x` int NOT NULL DEFAULT '0',
    `y` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `ships_users_FK` (`user_id`),
    KEY `ships_main_map_hubs_FK` (`main_map_hub_id`),
    CONSTRAINT `ships_main_map_hubs_FK` FOREIGN KEY (`main_map_hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `ships_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `translations`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `translations` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `code_name` varchar(255) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      `text` text,
      PRIMARY KEY (`id`),
      UNIQUE KEY `translations_name` (`code_name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `translations_languages`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `translations_languages` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `language_id` int unsigned NOT NULL,
    `translation_id` int unsigned NOT NULL,
    `text` text NOT NULL,
    PRIMARY KEY (`id`),
    KEY `translations_languages_languages_FK` (`language_id`),
    KEY `translations_languages_translations_FK` (`translation_id`),
    CONSTRAINT `translations_languages_languages_FK` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
    CONSTRAINT `translations_languages_translations_FK` FOREIGN KEY (`translation_id`) REFERENCES `translations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tree_branches`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `tree_branches` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `tree_id` int unsigned NOT NULL,
    `previous_branch_id` int unsigned DEFAULT NULL,
    `on_depth` int unsigned NOT NULL,
    `hub_number` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `tree_branches_trees_FK` (`tree_id`),
    KEY `tree_branches_tree_branches_FK` (`previous_branch_id`),
    CONSTRAINT `tree_branches_tree_branches_FK` FOREIGN KEY (`previous_branch_id`) REFERENCES `tree_branches` (`id`),
    CONSTRAINT `tree_branches_trees_FK` FOREIGN KEY (`tree_id`) REFERENCES `trees` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trees`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `trees` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `on_depth` int unsigned NOT NULL,
    `hub_number` int unsigned NOT NULL,
    `iteration_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `trees_iterations_FK` (`iteration_id`),
    CONSTRAINT `trees_iterations_FK` FOREIGN KEY (`iteration_id`) REFERENCES `iterations` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_been_to_hubs`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `user_been_to_hubs` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `hub_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_been_to_hubs_users_FK` (`user_id`),
    KEY `user_been_to_hubs_main_map_hubs_FK` (`hub_id`),
    CONSTRAINT `user_been_to_hubs_main_map_hubs_FK` FOREIGN KEY (`hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `user_been_to_hubs_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_islands`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `user_islands` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `main_map_hub_id` int unsigned DEFAULT NULL,
    `hub_pos_x` int NOT NULL DEFAULT '0',
    `hub_pos_y` int NOT NULL DEFAULT '0',
    `layer` int unsigned NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `user_islands_users_FK` (`user_id`),
    KEY `user_islands_main_map_hubs_FK` (`main_map_hub_id`),
    CONSTRAINT `user_islands_main_map_hubs_FK` FOREIGN KEY (`main_map_hub_id`) REFERENCES `main_map_hubs` (`id`),
    CONSTRAINT `user_islands_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_sessions`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `user_sessions` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expire` datetime DEFAULT NULL,
    `token` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_users_FK` (`user_id`),
    CONSTRAINT `sessions_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_ship_modules`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `user_ship_modules` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `module_type_id` int unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_ship_modules_users_FK` (`user_id`),
    KEY `user_ship_modules_ships_FK` (`ship_id`),
    KEY `user_ship_modules_ship_module_types_FK` (`module_type_id`),
    CONSTRAINT `user_ship_modules_ship_module_types_FK` FOREIGN KEY (`module_type_id`) REFERENCES `ship_module_types` (`id`),
    CONSTRAINT `user_ship_modules_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `user_ship_modules_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_ship_parts`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `user_ship_parts` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int unsigned NOT NULL,
    `ship_id` int unsigned DEFAULT NULL,
    `ship_part_type_id` int unsigned DEFAULT NULL,
    `speed_change` int DEFAULT '0',
    `physical_defense_change` int DEFAULT '0',
    `maximum_crew_change` int DEFAULT '0',
    `max_weight_change` int DEFAULT '0',
    `attack_power_change` int DEFAULT '0',
    `energy_consumption_change` int DEFAULT '0',
    `subtype_id` int unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_ship_parts_users_FK` (`user_id`),
    KEY `user_ship_parts_ships_FK` (`ship_id`),
    KEY `user_ship_parts_ship_part_types_FK` (`ship_part_type_id`),
    KEY `user_ship_parts_ship_part_subtypes_FK` (`subtype_id`),
    CONSTRAINT `user_ship_parts_ship_part_subtypes_FK` FOREIGN KEY (`subtype_id`) REFERENCES `ship_part_subtypes` (`id`),
    CONSTRAINT `user_ship_parts_ship_part_types_FK` FOREIGN KEY (`ship_part_type_id`) REFERENCES `ship_part_types` (`id`),
    CONSTRAINT `user_ship_parts_ships_FK` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`id`),
    CONSTRAINT `user_ship_parts_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `users` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `firstname` varchar(100) DEFAULT NULL,
    `surname` varchar(100) DEFAULT NULL,
    `phone` varchar(30) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      `password` varchar(100) NOT NULL,
      `login_attempts` int DEFAULT '0',
      `verified` tinyint (1) DEFAULT '0',
      `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      `guild_id` int unsigned DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `users_username` (`username`),
      UNIQUE KEY `users_email` (`email`),
      UNIQUE KEY `users_phone` (`phone`),
      KEY `users_guilds_FK` (`guild_id`),
      CONSTRAINT `users_guilds_FK` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'extorris'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-29 14:48:42