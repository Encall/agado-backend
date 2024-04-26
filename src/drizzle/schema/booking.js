const {
    int,
    mysqlTable,
    datetime,
    varchar,
} = require('drizzle-orm/mysql-core');
const passenger = require('./passenger');
const flight = require('./flight');
const userAccount = require('./userAccount');

const booking = mysqlTable('booking', {
    bookingID: varchar('bookingID', { length: 36 }).primaryKey(),
    passengerID: varchar('passengerID', { length: 36 }).references(
        () => passenger.passengerID
    ),
    flightID: int('flightID').references(() => flight.flightID),
    userID: varchar('userID', { length: 36 }).references(() => userAccount.userID),
    bookingDateTime: datetime('bookingDateTime', { mode: 'date', fsp: 6 }),
});

module.exports = booking;
