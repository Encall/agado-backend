const {
    int,
    datetime,
    mysqlTable,
    varchar,
} = require('drizzle-orm/mysql-core');
const ticket = require('./ticket');

const checkIn = mysqlTable('checkIn', {
    checkInID: int('checkInID').primaryKey().autoincrement(),
    ticketNo: varchar('ticketNo', { length: 36 }).references(() => ticket.ticketNo),
    checkInDateTime: datetime('checkInDateTime', { mode: 'date', fsp: 6 }),
    gate: int('gate').notNull(),
    boardingSequence: int('boardingSequence').notNull(),
});

module.exports = checkIn;
