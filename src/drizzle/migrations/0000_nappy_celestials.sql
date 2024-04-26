CREATE TABLE `airport` (
	`airportID` serial AUTO_INCREMENT NOT NULL,
	`airportName` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`IATACode` varchar(255) NOT NULL,
	`ICAOCode` varchar(255) NOT NULL,
	CONSTRAINT `airport_airportID` PRIMARY KEY(`airportID`)
);
--> statement-breakpoint
CREATE TABLE `userAccount` (
	`userID` varchar(36) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	CONSTRAINT `userAccount_userID` PRIMARY KEY(`userID`)
);
