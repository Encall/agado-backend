const { int, mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

const airport = mysqlTable('airport', {
    airportID: int('airportID').primaryKey().autoincrement(),
    airportName: varchar('airportName', { length: 255 }).notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    IATACode: varchar('IATACode', { length: 255 }).notNull(),
    ICAOCode: varchar('ICAOCode', { length: 255 }).notNull()
});

module.exports = airport;