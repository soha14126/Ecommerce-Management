// backend/config/db.js
// MySQL connection pool using mysql2

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'online_shopping',
    port:     process.env.DB_PORT     || 3306,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    // SSL is REQUIRED for most cloud databases (Render/Aiven/TiDB)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

// Test connection on startup
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ MySQL connected successfully (' + (process.env.DB_SSL === 'true' ? 'SSL Active' : 'Local') + ')');
        conn.release();
    } catch (err) {
        console.error('❌ MySQL connection failed:', err.message);
        // Note: Don't exit process in production if you want the app to stay up for debugging
        if (process.env.NODE_ENV === 'production') {
            console.error('Check your Environment Variables!');
        } else {
            process.exit(1);
        }
    }
})();

module.exports = pool;
