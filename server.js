import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static(__dirname));

const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    // 1️⃣ Get location key
    const locURL = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`;
    const locRes = await fetch(locURL);
    const locData = await locRes.json();

    if (!locData || !locData[0]) {
      return res.status(404).json({ error: "City not found" });
    }

    const locationKey = locData[0].Key;

    // 2️⃣ Get weather
    const weatherURL = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true`;
    const wRes = await fetch(weatherURL);
    const wData = await wRes.json();

    if (!wData || !wData[0]) {
      return res.status(500).json({ error: "Weather not found" });
    }

    res.json(wData[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
