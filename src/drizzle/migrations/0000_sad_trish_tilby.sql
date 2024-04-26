CREATE TABLE `aircraft` (
	`aircraftID` int AUTO_INCREMENT NOT NULL,
	`airlineID` int,
	`aircraftType` varchar(255) NOT NULL,
	`manufacturer` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	`maxCapacity` int NOT NULL,
	CONSTRAINT `aircraft_aircraftID` PRIMARY KEY(`aircraftID`)
);

CREATE TABLE `airline` (
	`airlineID` int AUTO_INCREMENT NOT NULL,
	`airlineName` varchar(255) NOT NULL,
	`IATACode` varchar(255) NOT NULL,
	`ICAOCode` varchar(255) NOT NULL,
	CONSTRAINT `airline_airlineID` PRIMARY KEY(`airlineID`)
);

CREATE TABLE `airport` (
	`airportID` int AUTO_INCREMENT NOT NULL,
	`airportName` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`IATACode` varchar(255) NOT NULL,
	`ICAOCode` varchar(255) NOT NULL,
	CONSTRAINT `airport_airportID` PRIMARY KEY(`airportID`)
);

CREATE TABLE `booking` (
	`bookingID` int AUTO_INCREMENT NOT NULL,
	`passengerID` int,
	`flightID` int,
	`userID` int,
	`bookingDateTime` datetime(6),
	CONSTRAINT `booking_bookingID` PRIMARY KEY(`bookingID`)
);

CREATE TABLE `checkIn` (
	`checkInID` int AUTO_INCREMENT NOT NULL,
	`ticketNo` int,
	`checkInDateTime` datetime(6),
	`seatNumber` varchar(255) NOT NULL,
	`gate` int NOT NULL,
	`boardingSequence` int NOT NULL,
	CONSTRAINT `checkIn_checkInID` PRIMARY KEY(`checkInID`)
);

CREATE TABLE `department` (
	`departmentID` int AUTO_INCREMENT NOT NULL,
	`departmentName` varchar(255) NOT NULL,
	`airlineID` int,
	CONSTRAINT `department_departmentID` PRIMARY KEY(`departmentID`)
);

CREATE TABLE `employee` (
	`employeeID` int AUTO_INCREMENT NOT NULL,
	`password` varchar(255) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`departmentID` int,
	`position` varchar(255) NOT NULL,
	`salary` float NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date,
	CONSTRAINT `employee_employeeID` PRIMARY KEY(`employeeID`)
);

CREATE TABLE `employeeTask` (
	`employeeID` int NOT NULL,
	`assignDateTime` datetime(6) NOT NULL,
	`taskType` varchar(255) NOT NULL,
	`taskDescription` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`flightID` int,
	CONSTRAINT `employeeTask_employeeID_assignDateTime_pk` PRIMARY KEY(`employeeID`,`assignDateTime`)
);

CREATE TABLE `externalService` (
	`externalServiceID` int AUTO_INCREMENT NOT NULL,
	`ticketNo` int,
	`serviceType` varchar(255) NOT NULL,
	`serviceDetail` varchar(255) NOT NULL,
	`serviceFee` float NOT NULL,
	CONSTRAINT `externalService_externalServiceID` PRIMARY KEY(`externalServiceID`)
);

CREATE TABLE `flight` (
	`flightID` int AUTO_INCREMENT NOT NULL,
	`aircraftID` int,
	`departureAirportID` int,
	`arrivalAirportID` int,
	`arrivalDateTime` datetime(6),
	`departureDateTime` datetime(6),
	`flightNo` int NOT NULL,
	`currentCapacity` int NOT NULL,
	`status` varchar(255) NOT NULL,
	CONSTRAINT `flight_flightID` PRIMARY KEY(`flightID`)
);

CREATE TABLE `passenger` (
	`passengerID` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	CONSTRAINT `passenger_passengerID` PRIMARY KEY(`passengerID`)
);

CREATE TABLE `payment` (
	`paymentID` int AUTO_INCREMENT NOT NULL,
	`bookingID` int,
	`userID` int,
	`amount` float NOT NULL,
	`paymentDateTime` datetime(6),
	`paymentMethod` varchar(255) NOT NULL,
	CONSTRAINT `payment_paymentID` PRIMARY KEY(`paymentID`)
);

CREATE TABLE `ticket` (
	`ticketNo` int AUTO_INCREMENT NOT NULL,
	`bookingID` varchar(255) NOT NULL,
	`passengerID` serial AUTO_INCREMENT,
	`price` float NOT NULL,
	`seatNumber` varchar(255) NOT NULL,
	`class` varchar(255) NOT NULL,
	CONSTRAINT `ticket_ticketNo` PRIMARY KEY(`ticketNo`)
);

CREATE TABLE `userAccount` (
	`userID` varchar(36) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	CONSTRAINT `userAccount_userID` PRIMARY KEY(`userID`)
);

ALTER TABLE `aircraft` ADD CONSTRAINT `aircraft_airlineID_airline_airlineID_fk` FOREIGN KEY (`airlineID`) REFERENCES `airline`(`airlineID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `booking` ADD CONSTRAINT `booking_passengerID_passenger_passengerID_fk` FOREIGN KEY (`passengerID`) REFERENCES `passenger`(`passengerID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `booking` ADD CONSTRAINT `booking_flightID_flight_flightID_fk` FOREIGN KEY (`flightID`) REFERENCES `flight`(`flightID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `booking` ADD CONSTRAINT `booking_userID_userAccount_userID_fk` FOREIGN KEY (`userID`) REFERENCES `userAccount`(`userID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `checkIn` ADD CONSTRAINT `checkIn_ticketNo_ticket_ticketNo_fk` FOREIGN KEY (`ticketNo`) REFERENCES `ticket`(`ticketNo`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `department` ADD CONSTRAINT `department_airlineID_airline_airlineID_fk` FOREIGN KEY (`airlineID`) REFERENCES `airline`(`airlineID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `employee` ADD CONSTRAINT `employee_departmentID_department_departmentID_fk` FOREIGN KEY (`departmentID`) REFERENCES `department`(`departmentID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `employeeTask` ADD CONSTRAINT `employeeTask_employeeID_employee_employeeID_fk` FOREIGN KEY (`employeeID`) REFERENCES `employee`(`employeeID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `employeeTask` ADD CONSTRAINT `employeeTask_flightID_flight_flightID_fk` FOREIGN KEY (`flightID`) REFERENCES `flight`(`flightID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `externalService` ADD CONSTRAINT `externalService_ticketNo_ticket_ticketNo_fk` FOREIGN KEY (`ticketNo`) REFERENCES `ticket`(`ticketNo`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `flight` ADD CONSTRAINT `flight_aircraftID_aircraft_aircraftID_fk` FOREIGN KEY (`aircraftID`) REFERENCES `aircraft`(`aircraftID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `flight` ADD CONSTRAINT `flight_departureAirportID_airport_airportID_fk` FOREIGN KEY (`departureAirportID`) REFERENCES `airport`(`airportID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `flight` ADD CONSTRAINT `flight_arrivalAirportID_airport_airportID_fk` FOREIGN KEY (`arrivalAirportID`) REFERENCES `airport`(`airportID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `payment` ADD CONSTRAINT `payment_bookingID_booking_bookingID_fk` FOREIGN KEY (`bookingID`) REFERENCES `booking`(`bookingID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `payment` ADD CONSTRAINT `payment_userID_booking_userID_fk` FOREIGN KEY (`userID`) REFERENCES `booking`(`userID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_passengerID_passenger_passengerID_fk` FOREIGN KEY (`passengerID`) REFERENCES `passenger`(`passengerID`) ON DELETE no action ON UPDATE no action;