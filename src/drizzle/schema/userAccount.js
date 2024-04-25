const { mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

exports.userAccount = mysqlTable( "userAccount",{
    userID: serial('userID').primaryKey(),
    firstName: varchar('firstName',{ length: 255 }).notNull(),
    lastName: varchar('lastName',{ length: 255 }).notNull(),
    email: varchar('email',{ length: 255 }).notNull(),
    password: varchar('password',{ length: 255 }).notNull(),
    phone: varchar('phone',{ length: 255 }).notNull()
});

module.exports = exports;