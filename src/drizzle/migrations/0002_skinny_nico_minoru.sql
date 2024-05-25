ALTER TABLE `aircraft` ADD CONSTRAINT `aircraft_aircraftCallSign_unique` UNIQUE(`aircraftCallSign`);
ALTER TABLE `aircraft` ADD `status` int NOT NULL;
ALTER TABLE `booking` ADD `bookingStatus` varchar(20) NOT NULL;