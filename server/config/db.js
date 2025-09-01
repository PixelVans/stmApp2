require('dotenv').config();
const sql = require('mssql');

const stmdev25 = {
  user: process.env.STMDEV25_USER,
  password: process.env.STMDEV25_PASSWORD,
  server: process.env.STMDEV25_SERVER,
  database: process.env.STMDEV25_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const specialisedSystems = {
  user: process.env.STMDEV25_USER,
  password: process.env.STMDEV25_PASSWORD,
  server: process.env.STMDEV25_SERVER,
  database: process.env.SPECIALISEDSYSTEMS_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};


const connectToDB1 = async () => {
  try {
    const pool = await sql.connect(stmdev25);
    // console.log('Connected to SQL Server (stmdev25)');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

const connectToDB2 = async () => {
  try {
    console.log("Trying to connect to DB:", process.env.SPECIALISEDSYSTEMS_DATABASE);

    const pool = await sql.connect(specialisedSystems);

    console.log("✅ Connected to:", process.env.SPECIALISEDSYSTEMS_DATABASE);
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};



module.exports = {
  sql,
  connectToDB1,
  connectToDB2,
};
