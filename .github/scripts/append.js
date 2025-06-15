const fs = require('fs');

const body = process.env.ISSUE_BODY || '';
const title = process.env.ISSUE_TITLE || '';

const latMatch = body.match(/Lat\/Lng\*\*: ([\d\.\-]+),\s*([\d\.\-]+)/);
const labelMatch = body.match(/\*\*Label\*\*: (.+)/);

if (!latMatch || !labelMatch) {
  console.error("Missing lat/lng or label in issue");
  process.exit(1);
}

const lat = parseFloat(latMatch[1]);
const lng = parseFloat(latMatch[2]);
const label = labelMatch[1].trim();

const newEntry = { lat, lng, label };

const locationsPath = 'locations.json';
const json = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));
json.push(newEntry);

fs.writeFileSync(locationsPath, JSON.stringify(json, null, 2));
console.log("Added new porta-potty:", newEntry);
