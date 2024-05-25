const { int, mysqlTable, varchar, date } = require('drizzle-orm/mysql-core');
const booking = require('./booking');

const passenger = mysqlTable('passenger', {
    passengerID: varchar('passengerID', { length: 36 }).primaryKey(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    middleName: varchar('middleName', { length: 255 }),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phoneNumber: varchar('phoneNumber', { length: 255 }).notNull(),
    dateOfBirth: date('dateOfBirth').notNull(),
    nationaltiy: varchar('nationality', { length: 255 }).notNull(),
    bookingID: varchar('bookingID', { length: 36 }).references(
        () => booking.bookingID,
        { onDelete: 'cascade' },
        { onUpdate: 'cascade' }
    ),
    luggageWeight: int('luggageWeight').notNull(),
});

module.exports = passenger;
