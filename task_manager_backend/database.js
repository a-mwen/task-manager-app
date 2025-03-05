require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool with your database credentials
const pool = new Pool({
    user: process.env.DB_USER ,
    host: process.env.DB_HOST ,
    database: process.env.DB_NAME ,
    password: process.env.DB_PASSWORD ,  // Add your DB password here
    port: process.env.DB_PORT, // Default PostgreSQL port
});

// Export the pool to use it in other files
module.exports = pool;
