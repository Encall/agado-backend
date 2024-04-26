const { int, mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');
const {airline} = require('./airline');

const department = mysqlTable("department", {
    departmentID: int('departmentID').primaryKey().autoincrement(),
    departmentName: varchar('departmentName', { length: 255 }).notNull(),
    airlineID: int('airlineID').references(()=>airline.airlineID)
});

module.exports = department;