const { int, float, mysqlTable, varchar } = require('drizzle-orm/mysql-core');
const ticket = require('./ticket');

const externalService = mysqlTable('externalService', {
    externalServiceID: int('externalServiceID').primaryKey().autoincrement(),
    ticketNo: varchar('ticketNo', { length: 36 }).references(
        () => ticket.ticketNo,
        { onDelete: 'CASCADE' },
        { onUpdate: 'CASCADE' }
    ),
    serviceType: varchar('serviceType', { length: 255 }).notNull(),
    serviceDetail: varchar('serviceDetail', { length: 255 }).notNull(),
    serviceFee: float('serviceFee').notNull(),
});

module.exports = externalService;
