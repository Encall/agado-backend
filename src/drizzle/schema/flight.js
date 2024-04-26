const {
    int,
    datetime,
    mysqlTable,
    varchar,
} = require('drizzle-orm/mysql-core');
const aircraft = require('./aircraft');
const airport = require('./airport');

const flight = mysqlTable('flight', {
    flightID: int('flightID').primaryKey().autoincrement(),
    aircraftID: int('aircraftID').references(() => aircraft.aircraftID),
    departureAirportID: int('departureAirportID').references(
        () => airport.airportID
    ),
    arrivalAirportID: int('arrivalAirportID').references(
        () => airport.airportID
    ),
    arrivalDateTime: datetime('arrivalDateTime', { mode: 'date', fsp: 6 }),
    departureDateTime: datetime('departureDateTime', { mode: 'date', fsp: 6 }),
    flightNo: varchar('flightNo', { length: 255 }).notNull(),
    currentCapacity: int('currentCapacity').notNull(),
    status: varchar('status', { length: 255 }).notNull(),
});

module.exports = flight;
