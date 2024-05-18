ALTER TABLE `booking` MODIFY COLUMN `flightID` int NOT NULL;
ALTER TABLE `booking` MODIFY COLUMN `userID` varchar(36) NOT NULL;
ALTER TABLE `booking` MODIFY COLUMN `bookingDateTime` datetime NOT NULL;