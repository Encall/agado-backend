const { int, float, mysqlTable, varchar } = require('drizzle-orm/mysql-core');
const passenger = require('./passenger');

const ticket = mysqlTable('ticket', {
    ticketNo: varchar('ticketNo', { length: 36 }).primaryKey(),
    bookingID: varchar('bookingID', { length: 255 }).notNull(),
    passengerID: varchar('passengerID', { length: 36 }).references(
        () => passenger.passengerID,
        { onDelete: 'CASCADE' },
        { onUpdate: 'CASCADE' }
    ),
    price: float('price').notNull(),
    seatNumber: varchar('seatNumber', { length: 255 }).notNull(),
    class: varchar('class', { length: 255 }).notNull(),
});

module.exports = ticket;
