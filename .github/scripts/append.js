const fs = require('fs');

const body = process.env.ISSUE_BODY || '';
const title = process.env.ISSUE_TITLE || '';

const latMatch = body.match(/\*\*Lat\/Lng\*\*:\s*([\d\.\-]+),\s*([\d\.\-]+)/);
const labelMatch = body.match(/\*\*Label\*\*:\s*(.*)/);

if (!latMatch) {
  console.error("❌ Missing Lat/Lng in issue body");
  process.exit(1);
}

const lat = parseFloat(latMatch[1]);
const lng = parseFloat(latMatch[2]);
const label = labelMatch && labelMatch[1].trim() !== '' ? labelMatch[1].trim() : "Unnamed PortaPotty";

const newEntry = { lat, lng, label };

const locationsPath = 'locations.json';
const json = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));
json.push(newEntry);

fs.writeFileSync(locationsPath, JSON.stringify(json, null, 2));
console.log("✅ Added new porta-potty:", newEntry);
