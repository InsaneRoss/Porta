const fs = require("fs");
const https = require("https");

const ADD_SHEET = "https://opensheet.elk.sh/1-3Oc_Z1lSFgz5IKq23fjEazebDl2K-G7xsKOyXFKr3k/Form Responses 1";
const REMOVE_SHEET = "https://opensheet.elk.sh/1O4vqdvWyCAKDXy__NMUt_eHgy9UK1wfZzyIYFUFJS5E/Form Responses 1";

// Load existing locations.json (if it exists) to preserve Quarles entries
let preserved = [];
if (fs.existsSync("locations.json")) {
  try {
    const existing = JSON.parse(fs.readFileSync("locations.json", "utf8"));
    preserved = existing.filter(loc => loc.label === "Quarles");
  } catch (e) {
    console.warn("⚠️ Failed to parse existing locations.json");
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

(async () => {
  try {
    const addData = await fetchJson(ADD_SHEET);
    const removeData = await fetchJson(REMOVE_SHEET);

    const removedSet = new Set(
      removeData.map(r => `${r["Latitude"]},${r["Longitude"]}`)
    );

    // Process new form submissions
    const fromForms = addData.map(entry => ({
      lat: parseFloat(entry["Latitude"]),
      lng: parseFloat(entry["Longitude"]),
      label: entry["Label"] || "PortaPotty"
    }));

    fs.writeFileSync("locations_backup.json", JSON.stringify(fromForms, null, 2));

    // Filter out removed locations (but preserve Quarles no matter what)
    const filteredForms = fromForms.filter(loc => {
      const key = `${loc.lat},${loc.lng}`;
      return !removedSet.has(key);
    });

    // Combine preserved Quarles + current valid submissions
    const combined = [...preserved, ...filteredForms];

    // Optional: remove accidental duplicates (same lat/lng)
    const seen = new Set();
    const final = combined.filter(loc => {
      const key = `${loc.lat},${loc.lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    fs.writeFileSync("locations.json", JSON.stringify(final, null, 2));
    console.log("✅ Synced: locations.json and locations_backup.json");
  } catch (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  }
})();
