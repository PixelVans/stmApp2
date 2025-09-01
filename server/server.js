require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const os = require('os');

const { connectToDB1,connectToDB2 } = require('./config/db');
const scouring = require('./routes/dyeing/scouring');
const hotwash = require('./routes/dyeing/hotwash');
const prepareToDye = require('./routes/dyeing/prepareToDye');
const dyeing = require('./routes/dyeing/dyeing');
const firstRinse = require('./routes/dyeing/firstRinse');
const soaping = require('./routes/dyeing/soaping');
const finalRinse = require('./routes/dyeing/finalRinse');
const finishing = require('./routes/dyeing/finishing');
const chemicals = require('./routes/dyeing/chemicals');
const dyestuffs = require('./routes/dyeing/dyestuffs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes

app.use('/api/scouring', scouring);
app.use('/api/hotwash', hotwash);
app.use('/api/dyeing', dyeing);
app.use('/api/prepare-to-dye', prepareToDye);
app.use('/api/first-rinse', firstRinse);
app.use('/api/soaping', soaping);
app.use('/api/final-rinse', finalRinse);
app.use('/api/finishing', finishing);
app.use('/api/chemicals', chemicals);
app.use('/api/dyestuff', dyestuffs);


const reactBuildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(reactBuildPath));


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


app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});


app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await connectToDB1();
  await connectToDB2();
});
