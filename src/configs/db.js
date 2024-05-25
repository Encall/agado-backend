// const { withReplicas } = require('drizzle-orm/mysql-core');
const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = db;
