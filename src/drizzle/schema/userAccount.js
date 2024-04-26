import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const userAccount = mysqlTable("userAccount", {
    userID: serial('userID').primaryKey(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    phoneNumber: varchar('phoneNumber', { length: 255 }).notNull()
});
