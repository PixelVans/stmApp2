// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { connectToDB } = require('./config/db');
const employeeRoutes = require('./routes/employees');
const departments = require('./routes/departments')
const scouring = require('./routes/scouring');
const hotwash = require('./routes/hotwash')
const prepareToDye = require('./routes/prepareToDye')
const dyeing = require('./routes/dyeing')
const firstRinse = require('./routes/firstRinse')
const soaping = require('./routes/soaping')

const os = require('os');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departments);
app.use('/api/scouring',scouring);
app.use('/api/hotwash',hotwash);
app.use('/api/dyeing',dyeing);
app.use('/api/prepare-to-dye', prepareToDye);
app.use('/api/first-rinse', firstRinse);
app.use('/api/soaping', soaping);

app.get('/', (req, res) => {
  const hostname = os.hostname();
  const ip = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;
  const uptime = process.uptime();
  const now = new Date().toLocaleString();

  res.send(`
    <h2>STM Server Running</h2>
    <ul>
      <li><strong>📡 LAN Access:</strong> http://${ip}:3000</li>
      <li><strong>🕒 Current Time:</strong> ${now}</li>
      <li><strong>🔧 Machine:</strong> HP Proliant ML110 G6 (${hostname})</li>
      <li><strong>🚀 Uptime:</strong> ${Math.floor(uptime / 60)} minutes</li>
      <li><strong>📁 Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
    </ul>
  `);
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await connectToDB();
});
