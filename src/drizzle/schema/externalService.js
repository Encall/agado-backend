const { int,float,date, mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');
const {ticket} = require('./ticket');
const externalService = mysqlTable("externalService", {
    externalServiceID: int('externalServiceID').primaryKey().autoincrement(),
    ticketNo: int('ticketNo').references(()=>ticket.ticketNo),
    serviceType: varchar('serviceType', { length: 255 }).notNull(),
    serviceDetail: varchar('serviceDetail', { length: 255 }).notNull(),
    serviceFee: float('serviceFee').notNull(),
});

module.exports = externalService;