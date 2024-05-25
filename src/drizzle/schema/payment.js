const {
    float,
    int,
    mysqlTable,
    datetime,
    varchar,
} = require('drizzle-orm/mysql-core');
const booking = require('./booking');

const payment = mysqlTable('payment', {
    paymentID: varchar('paymentID', { length: 36 }).primaryKey(),
    bookingID: varchar('bookingID', { length: 36 }).references(
        () => booking.bookingID
    ),
    userID: varchar('userID', { length: 36 }).references(() => booking.userID),
    amount: float('amount').notNull(),
    paymentDateTime: datetime('paymentDateTime', { mode: 'date' }),
    cardNumber: varchar('cardNumber', { length: 255 }).notNull(),
    holderName: varchar('holderName', { length: 255 }).notNull(),
    ccv: varchar('ccv', { length: 255 }).notNull(),
    expiryDate: varchar('expiryDate', { length: 255 }).notNull(),
});

module.exports = payment;
