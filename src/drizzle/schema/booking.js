const {
    int,
    mysqlTable,
    datetime,
    varchar,
} = require('drizzle-orm/mysql-core');
const flight = require('./flight');
const userAccount = require('./userAccount');

const booking = mysqlTable('booking', {
    bookingID: varchar('bookingID', { length: 36 }).primaryKey(),
    flightID: int('flightID').references(() => flight.flightID, { onDelete: 'cascade' }, { onUpdate: 'cascade' }),
    userID: varchar('userID', { length: 36 }).references(() => userAccount.userID),
    bookingDateTime: datetime('bookingDateTime', { mode: 'date'}),
});

module.exports = booking;
