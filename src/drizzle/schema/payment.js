const { float,int, mysqlTable,datetime, varchar } = require('drizzle-orm/mysql-core');
const booking = require('./booking');

const payment = mysqlTable( "payment",{
    paymentID: int('paymentID').primaryKey().autoincrement(),
    bookingID: int('bookingID').references(()=>booking.bookingID),
    userID: int('userID').references(()=>booking.userID),
    amount: float('amount').notNull(),
    paymentDateTime: datetime('paymentDateTime', { mode: 'date', fsp: 6 }),
    paymentMethod: varchar('paymentMethod', { length: 255 }).notNull(),
});

module.exports = payment;