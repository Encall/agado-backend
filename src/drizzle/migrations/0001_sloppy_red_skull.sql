ALTER TABLE `airport` RENAME COLUMN `country` TO `countryCode`;
ALTER TABLE `airport` ADD `continent` varchar(255) NOT NULL;
ALTER TABLE `airport` ADD `latitude` decimal(10,8) NOT NULL;
ALTER TABLE `airport` ADD `longitude` decimal(11,8) NOT NULL;
ALTER TABLE `airport` DROP COLUMN `address`;