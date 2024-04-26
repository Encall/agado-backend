const { int, float,mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');
const passenger = require('./passenger');
const ticket = mysqlTable( "ticket",{
    ticketNo: int('ticketNo').primaryKey().autoincrement(),
    bookingID: varchar('bookingID', { length: 255 }).notNull(),
    passengerID: serial('passengerID').references(()=>passenger.passengerID),
    price: float('price').notNull(),
    class: varchar('class', { length: 255 }).notNull(),
});

module.exports = ticket;