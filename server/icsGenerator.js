function toIcsDate(isoStr) {
  const [date, time] = isoStr.split('T');
  return date.replace(/-/g, '') + 'T' + time.replace(/:/g, '');
}

function foldLine(line) {
  // ICS lines should be max 75 octets; fold longer ones
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  while (start < line.length) {
    if (start === 0) {
      parts.push(line.slice(0, 75));
      start = 75;
    } else {
      parts.push(' ' + line.slice(start, start + 74));
      start += 74;
    }
  }
  return parts.join('\r\n');
}

function generateIcs(slot, bikeIndex, name, email) {
  const bikeNum = bikeIndex + 1;
  const uid = `calm-bike-ride-slot-${slot.id}-bike-${bikeNum}-${Date.now()}@truetechnology`;
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const description = [
    `You are riding Bike ${bikeNum} for the Budapest Bike Ride for CALM.`,
    ``,
    `Slot ${slot.id}: ${slot.label} (${slot.period})`,
    `Target: 10.4 km in 30 min at 20.8 km/h`,
    ``,
    `Please warm up 3-5 minutes before your slot and be ready`,
    `for a smooth transition (under 2 minutes).`,
    ``,
    `Raising money for CALM - the Campaign Against Living Miserably.`,
  ].join('\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//True Technology//CALM Budapest Bike Ride 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Europe/London:${toIcsDate(slot.start)}`,
    `DTEND;TZID=Europe/London:${toIcsDate(slot.end)}`,
    `SUMMARY:Budapest Bike Ride for CALM - Slot ${slot.id} (Bike ${bikeNum})`,
    'LOCATION:Hays House Guildford',
    foldLine(`DESCRIPTION:${description}`),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return lines;
}

module.exports = { generateIcs };
