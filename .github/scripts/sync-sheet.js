const fs = require('fs');
const https = require('https');

const url = 'https://opensheet.elk.sh/1-3Oc_Z1lSFgz5IKq23fjEazebDl2K-G7xsKOyXFKr3k/Form%20Responses%201';
const locationsPath = 'locations.json';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject('Failed to parse JSON: ' + err);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  const sheetData = await fetchJson(url);

  if (!fs.existsSync(locationsPath)) {
    fs.writeFileSync(locationsPath, '[]');
  }

  const existing = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));
  const seen = new Set(existing.map(e => `${e.lat},${e.lng}`));

  let added = 0;
  for (const row of sheetData) {
    const lat = parseFloat(row.Latitude);
    const lng = parseFloat(row.Longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const key = `${lat},${lng}`;
      if (!seen.has(key)) {
        existing.push({
          lat,
          lng,
          label: row.Label?.trim() || 'Unnamed PortaPotty'
        });
        seen.add(key);
        added++;
      }
    }
  }

  fs.writeFileSync(locationsPath, JSON.stringify(existing, null, 2));
  console.log(`✅ Synced ${added} new porta-potties`);
})();