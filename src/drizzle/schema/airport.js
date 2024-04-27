const { int, mysqlTable, varchar , decimal } = require('drizzle-orm/mysql-core');

const airport = mysqlTable('airport', {
    airportID: int('airportID').primaryKey().autoincrement(),
    airportName: varchar('airportName', { length: 255 }).notNull(),
    continent: varchar('continent', { length: 255 }).notNull(),
    countryCode: varchar('countryCode', { length: 255 }).notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
    IATACode: varchar('IATACode', { length: 255 }).notNull(),
    ICAOCode: varchar('ICAOCode', { length: 255 }).notNull(),
});

module.exports = airport;
