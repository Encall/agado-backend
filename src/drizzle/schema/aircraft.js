const { int, mysqlTable, varchar } = require('drizzle-orm/mysql-core');
const airline = require('./airline');

const aircraft = mysqlTable('aircraft', {
    aircraftID: int('aircraftID').primaryKey().autoincrement(),
    airlineID: int('airlineID').references(() => airline.airlineID),
    aircraftType: varchar('aircraftType', { length: 255 }).notNull(),
    manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    maxCapacity: int('maxCapacity').notNull(),
});

module.exports = aircraft;
