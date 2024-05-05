// const { withReplicas } = require('drizzle-orm/mysql-core');
const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
});

// const readReplica1client = mysql.createPool({
//     host: process.env.DB_REPLICA1_HOST,
//     user: process.env.DB_REPLICA1_USERNAME,
//     password: process.env.DB_REPLICA1_PASSWORD,
//     database: process.env.DB_REPLICA1_NAME,
//     multipleStatements: true,
// });

// const readReplica2client = mysql.createPool({
//     host: process.env.DB_REPLICA2_HOST,
//     user: process.env.DB_REPLICA2_USERNAME,
//     password: process.env.DB_REPLICA2_PASSWORD,
//     database: process.env.DB_REPLICA2_NAME,
//     multipleStatements: true,
// });

// const primary = drizzle(connection)
// const replica1 = drizzle(readReplica1client)
// const replica2 = drizzle(readReplica2client)
// const db = withReplicas(drizzle(primary), replica1, replica2);

const db = drizzle(connection, { mode: 'default' });

module.exports = db;
