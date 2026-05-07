const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'rota.json');

function generateSlots() {
  const slots = [];
  let day = 21, hour = 10, min = 0;

  for (let i = 1; i <= 48; i++) {
    const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
    const startTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    const startISO = `${dateStr}T${startTime}:00`;

    let eMin = min + 30, eHour = hour, eDay = day;
    if (eMin >= 60) { eMin = 0; eHour++; }
    if (eHour >= 24) { eHour = 0; eDay++; }
    const endDateStr = `2026-05-${String(eDay).padStart(2, '0')}`;
    const endTime = `${String(eHour).padStart(2, '0')}:${String(eMin).padStart(2, '0')}`;
    const endISO = `${endDateStr}T${endTime}:00`;

    let period;
    const hm = hour * 60 + min;
    if (day === 21) {
      if (hm >= 10 * 60 && hm < 18 * 60) period = 'Day';
      else if (hm >= 18 * 60 && hm < 22 * 60) period = 'Evening';
      else period = 'Night';
    } else {
      period = hm < 6 * 60 ? 'Night' : 'Morning';
    }

    slots.push({
      id: i,
      label: `${startTime} – ${endTime}`,
      start: startISO,
      end: endISO,
      period,
      bikes: [null, null, null],
    });

    min += 30;
    if (min >= 60) { min = 0; hour++; }
    if (hour >= 24) { hour = 0; day++; }
  }

  return slots;
}

function loadRota() {
  if (!fs.existsSync(dataPath)) {
    const initial = { slots: generateSlots() };
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveRota(rota) {
  fs.writeFileSync(dataPath, JSON.stringify(rota, null, 2));
}

function getRota() {
  return loadRota();
}

function signUp(slotId, bikeIndex, name, email) {
  const rota = loadRota();
  const slot = rota.slots.find(s => s.id === slotId);

  if (!slot) return { ok: false, error: 'Slot not found' };
  if (bikeIndex < 0 || bikeIndex > 2) return { ok: false, error: 'Invalid bike number' };
  if (slot.bikes[bikeIndex] !== null) return { ok: false, error: 'This slot is already taken — please choose another' };
  if (slot.bikes.some(b => b && b.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'You are already signed up for this time slot on another bike' };
  }

  slot.bikes[bikeIndex] = { name, email };
  saveRota(rota);
  return { ok: true, slot };
}

module.exports = { getRota, signUp };
