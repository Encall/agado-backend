import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/drizzle/schema/*',
    out: './src/drizzle/migrations',
    driver: 'mysql2',
    dbCredentials: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    },
    breakpoints: false,
    // verbose: true,
    // strict: true
});
