CREATE TABLE `airport` (
	`AiportID` serial AUTO_INCREMENT NOT NULL,
	`AirportName` varchar(255) NOT NULL,
	`City` varchar(255) NOT NULL,
	`Country` varchar(255) NOT NULL,
	`Address` varchar(255) NOT NULL,
	`IATACode` varchar(255) NOT NULL,
	`ICAOCode` varchar(255) NOT NULL,
	CONSTRAINT `airport_AiportID` PRIMARY KEY(`AiportID`)
);
--> statement-breakpoint
CREATE TABLE `userAccount` (
	`UserID` serial AUTO_INCREMENT NOT NULL,
	`FirstName` varchar(255) NOT NULL,
	`LastName` varchar(255) NOT NULL,
	`Email` varchar(255) NOT NULL,
	`Password` varchar(255) NOT NULL,
	`Phone` varchar(255) NOT NULL,
	CONSTRAINT `userAccount_UserID` PRIMARY KEY(`UserID`)
);
