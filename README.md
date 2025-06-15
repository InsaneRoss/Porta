# Porta: Crowdsourced PortaPotty Locator 🚽

**Porta** is a mobile-friendly, serverless map app for finding and reporting public porta-potties. Built entirely with static files and hosted on GitHub Pages — no backend required!

## 🌐 Live Site

👉 [https://yourusername.github.io/Porta](https://yourusername.github.io/Porta)

## 🚀 Features

- 📍 View all public porta-potty locations on an interactive map
- 📡 Submit new ones by using your current GPS location or typing an address
- ❌ Report outdated or removed locations
- 📱 Fully mobile-optimized
- 💾 100% free, hosted on GitHub Pages

## 📥 Adding a PortaPotty

1. Go to [`add.html`](https://yourusername.github.io/Porta/add.html)
2. Choose:
   - 📍 **Use My Location**: Automatically fills lat/lng
   - 🏠 **Enter Address**: Address is saved and reviewed later
3. Fill in a short label/description
4. Click **Submit** — this will open a GitHub Issue for review

## ❌ Removing a Location

Click any marker on the map and choose **"Report as Removed"** — this will submit a GitHub Issue requesting removal.

## 🔧 Moderation

Submissions via GitHub Issues can be reviewed and added to `locations.json` manually. Address-based entries require manual geocoding using a tool like Google Maps or Nominatim.

## 🛠 Tech Stack

- Frontend: HTML + CSS + JavaScript
- Map: Leaflet.js + OpenStreetMap
- Hosting: GitHub Pages
- Submission System: GitHub Issues

## 🧪 Want to Help?

Feel free to open a PR, submit an issue, or suggest improvements! Porta is an open, community-first project.

