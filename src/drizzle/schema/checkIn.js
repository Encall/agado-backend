const { int,float,date, datetime, mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');
const ticket = require('./ticket');
const checkIn = mysqlTable("checkIn", {
    checkInID: int('checkInID').primaryKey().autoincrement(),
    ticketNo: int('ticketNo').references(()=>ticket.ticketNo),
    checkInDateTime:  datetime('checkInDateTime', { mode: 'date', fsp: 6 }),
    seatNumber: varchar('seatNumber', { length: 255 }).notNull(),
    gate: int('gate').notNull(),
    boardingSequence: int('boardingSequence').notNull(),
});

module.exports = checkIn;