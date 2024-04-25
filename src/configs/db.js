const {drizzle} = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('../drizzle/schema');



const { mysqlTable, serial, varchar } = require('drizzle-orm/mysql-core');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const userAccountschema = mysqlTable( 'userAccount',{
  UserID: serial('UserID').primaryKey(),
  FirstName: varchar('FirstName',{ length: 255 }).notNull(),
  LastName: varchar('LastName',{ length: 255 }).notNull(),
  Email: varchar('Email',{ length: 255 }).notNull(),
  Password: varchar('Password',{ length: 255 }).notNull(),
  Phone: varchar('Phone',{ length: 255 }).notNull()
});

const db = drizzle(connection, { mode: 'default', userAccountschema });

async function fetchUser() {
  const user = await db.select().from('userAccount');
  console.log(user);
}
fetchUser();

module.exports = db;