const {drizzle} = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('../drizzle/schema');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const db = drizzle(connection, { schema: {schema}, mode: 'default'});

module.exports = db;