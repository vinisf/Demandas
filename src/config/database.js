require('dotenv').config();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '',
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432
    }
});

module.exports = knex;
