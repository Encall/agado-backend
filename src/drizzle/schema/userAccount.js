const { int,mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

const userAccount = mysqlTable( "userAccount",{
    userID: int('userID').primaryKey().autoincrement(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 255 }).notNull()
});

module.exports = userAccount;