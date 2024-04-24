import { serial, int, text, varchar, primaryKey, mysqlTable , } from "drizzle-orm/mysql-core";

export const airport = mysqlTable( "airport",{
    AiportID: serial('AiportID').primaryKey(),
    AirportName: varchar('AirportName',{ length: 255 }).notNull(),
    City: varchar('City',{ length: 255 }).notNull(),
    Country: varchar('Country',{ length: 255 }).notNull(),
    Address: varchar('Address',{ length: 255 }).notNull(),
    IATACode: varchar('IATACode',{ length: 255 }).notNull(),
    ICAOCode: varchar('ICAOCode',{ length: 255 }).notNull()
});
