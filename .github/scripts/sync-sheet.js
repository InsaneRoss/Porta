
const fs = require("fs");
const https = require("https");

const ADD_SHEET = "https://opensheet.elk.sh/1-3Oc_Z1lSFgz5IKq23fjEazebDl2K-G7xsKOyXFKr3k/Form Responses 1";
const REMOVE_SHEET = "https://opensheet.elk.sh/1O4vqdvWyCAKDXy__NMUt_eHgy9UK1wfZzyIYFUFJS5E/Form Responses 1";

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

    // Backup of all submitted locations
    const fullBackup = addData.map(entry => ({
      lat: parseFloat(entry["Latitude"]),
      lng: parseFloat(entry["Longitude"]),
      label: entry["Label"] || "PortaPotty"
    }));

    fs.writeFileSync("locations_backup.json", JSON.stringify(fullBackup, null, 2));

    // Filtered locations used on the map
    const filtered = fullBackup.filter(loc => {
      const key = `${loc.lat},${loc.lng}`;
      return !removedSet.has(key);
    });

    fs.writeFileSync("locations.json", JSON.stringify(filtered, null, 2));

    console.log("✅ Synced: locations.json and locations_backup.json");
  } catch (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  }
})();
