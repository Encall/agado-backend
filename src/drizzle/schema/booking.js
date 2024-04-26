const { int, mysqlTable, datetime } = require('drizzle-orm/mysql-core');
const passenger = require('./passenger');
const flight = require('./flight');
const userAccount = require('./userAccount');

const booking = mysqlTable('booking', {
    bookingID: int('bookingID').primaryKey().autoincrement(),
    passengerID: int('passengerID').references(() => passenger.passengerID),
    flightID: int('flightID').references(() => flight.flightID),
    userID: int('userID').references(() => userAccount.userID),
    bookingDateTime: datetime('bookingDateTime', { mode: 'date', fsp: 6 }),
});

module.exports = booking;
