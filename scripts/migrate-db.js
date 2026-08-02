// scripts/migrate-db.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  console.log('Starting database migration...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
     multipleStatements: true,
  });

  try {
    const sqlPath = path.join(__dirname, '../init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing database schema...');
    await connection.query(sql);
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error executing migration:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
