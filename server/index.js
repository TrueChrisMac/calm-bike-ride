const express = require('express');
const cors = require('cors');
const path = require('path');
const { getRota, signUp, cancelBooking } = require('./rota');
const { generateIcs } = require('./icsGenerator');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/rota', (req, res) => {
  res.json(getRota());
});

app.post('/api/signup', (req, res) => {
  const { slotId, bikeIndex, name, email } = req.body;

  if (!name || !email || slotId == null || bikeIndex == null) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  const result = signUp(Number(slotId), Number(bikeIndex), name.trim(), email.trim().toLowerCase());
  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  const ics = generateIcs(result.slot, Number(bikeIndex), name.trim(), email.trim().toLowerCase());

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="calm-bike-ride-slot-${slotId}-bike-${Number(bikeIndex) + 1}.ics"`
  );
  res.send(ics);
});

app.post('/api/cancel', (req, res) => {
  const { slotId, bikeIndex, email } = req.body;

  if (!email || slotId == null || bikeIndex == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = cancelBooking(Number(slotId), Number(bikeIndex), email.trim().toLowerCase());
  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  res.json({ ok: true });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`\n  CALM Bike Ride server running at http://localhost:${PORT}\n`);
});
