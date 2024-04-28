const {
    int,
    float,
    date,
    mysqlTable,
    varchar,
} = require('drizzle-orm/mysql-core');
const department = require('./department');

const employee = mysqlTable('employee', {
    employeeID: int('employeeID').primaryKey().autoincrement(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    phoneNumber: varchar('phoneNumber', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    departmentID: int('departmentID').references(() => department.departmentID),
    position: varchar('position', { length: 255 }).notNull(),
    salary: float('salary').notNull(),
    permissionLevel: int('permissionLevel').notNull().default(1),
    startDate: date('startDate').notNull(),
    endDate: date('endDate'),
});

module.exports = employee;
