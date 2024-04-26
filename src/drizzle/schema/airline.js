const { int, mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

const airline = mysqlTable('airline', {
    airlineID: int('airlineID').primaryKey().autoincrement(),
    airlineName: varchar('airlineName', { length: 255 }).notNull(),
    IATACode: varchar('IATACode', { length: 255 }).notNull(),
    ICAOCode: varchar('ICAOCode', { length: 255 }).notNull()
});

module.exports = airline;