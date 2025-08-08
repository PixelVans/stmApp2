require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const connectToDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server (specialised Systems copy (stmdev)');
    return pool;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};

module.exports = {
  sql,
  connectToDB,
};
