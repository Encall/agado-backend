const { mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

exports.airport = mysqlTable( "airport",{
    airportID: serial('airportID').primaryKey(),
    airportName: varchar('airportName',{ length: 255 }).notNull(),
    city: varchar('city',{ length: 255 }).notNull(),
    country: varchar('country',{ length: 255 }).notNull(),
    address: varchar('address',{ length: 255 }).notNull(),
    IATAcode: varchar('IATACode',{ length: 255 }).notNull(),
    ICAOcode: varchar('ICAOCode',{ length: 255 }).notNull()
});

module.exports = exports;