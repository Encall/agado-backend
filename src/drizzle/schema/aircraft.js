const { int, mysqlTable, varchar } = require('drizzle-orm/mysql-core');
const airline = require('./airline');

const aircraft = mysqlTable('aircraft', {
    aircraftID: int('aircraftID').primaryKey().autoincrement(),
    airlineID: int('airlineID').references(
        () => airline.airlineID,
        { onDelete: 'SET NULL' },
        { onUpdate: 'CASCADE' }
    ),
    aircraftCallSign: varchar('aircraftCallSign', { length: 255 })
        .notNull()
        .unique(),
    manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    maxCapacity: int('maxCapacity').notNull(),
    status: int('status').notNull(),
});

module.exports = aircraft;
