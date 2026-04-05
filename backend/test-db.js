const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    console.log('Testing connection with:');
    console.log('HOST:', process.env.DB_HOST);
    console.log('USER:', process.env.DB_USER);
    console.log('PASS:', process.env.DB_PASSWORD ? '********' : '(empty)');
    console.log('NAME:', process.env.DB_NAME);

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'online_shopping'
        });
        const conn = await pool.getConnection();
        console.log('✅ Success: MySQL connected!');
        conn.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error: MySQL connection failed:', err.message);
        process.exit(1);
    }
})();
