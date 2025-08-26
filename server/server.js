require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const os = require('os');

const { connectToDB } = require('./config/db');
const employeeRoutes = require('./routes/employees');
const departments = require('./routes/departments');
const scouring = require('./routes/scouring');
const hotwash = require('./routes/hotwash');
const prepareToDye = require('./routes/prepareToDye');
const dyeing = require('./routes/dyeing');
const firstRinse = require('./routes/firstRinse');
const soaping = require('./routes/soaping');
const finalRinse = require('./routes/finalRinse');
const finishing = require('./routes/finishing');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departments);
app.use('/api/scouring', scouring);
app.use('/api/hotwash', hotwash);
app.use('/api/dyeing', dyeing);
app.use('/api/prepare-to-dye', prepareToDye);
app.use('/api/first-rinse', firstRinse);
app.use('/api/soaping', soaping);
app.use('/api/final-rinse', finalRinse);
app.use('/api/finishing', finishing);

// Serve React static files from Vite build
const reactBuildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(reactBuildPath));

// Optional debug route for server info
app.get('/server-info', (req, res) => {
  const hostname = os.hostname();
  const ip = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;
  const uptime = process.uptime();
  const now = new Date().toLocaleString();

  res.send(`
    <h2>STM Server Running</h2>
    <ul>
      <li><strong>📡 LAN Access:</strong> http://${ip}:${PORT}</li>
      <li><strong>🕒 Current Time:</strong> ${now}</li>
      <li><strong>🔧 Machine:</strong> HP Proliant ML110 G6 (${hostname})</li>
      <li><strong>🚀 Uptime:</strong> ${Math.floor(uptime / 60)} minutes</li>
      <li><strong>📁 Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
    </ul>
  `);
});

// Catch-all: serve React index.html for client-side routing
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// Start server and connect to DB
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await connectToDB();
});
