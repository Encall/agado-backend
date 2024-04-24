const { mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

exports.userAccount = mysqlTable( "userAccount",{
    UserID: serial('UserID').primaryKey(),
    FirstName: varchar('FirstName',{ length: 255 }).notNull(),
    LastName: varchar('LastName',{ length: 255 }).notNull(),
    Email: varchar('Email',{ length: 255 }).notNull(),
    Password: varchar('Password',{ length: 255 }).notNull(),
    Phone: varchar('Phone',{ length: 255 }).notNull()
});

module.exports = exports;