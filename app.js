const API_KEY = ""; // TEMP UNTIL YOU USE .env
// Search button
document.getElementById("searchBtn").addEventListener("click", getWeather);

// Pressing Enter also searches
document.getElementById("cityInput").addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please type a city first");

  // 1️⃣ Get Location Key
  const locationURL = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`;
  const locRes = await fetch(locationURL);
  const locData = await locRes.json();

  if (!locData[0]) {
    alert("City not found!");
    return;
  }

  const locationKey = locData[0].Key;

  // 2️⃣ Get Weather
  const weatherURL = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true`;
  const wRes = await fetch(weatherURL);
  const wData = await wRes.json();

  const weather = wData[0];

  // Update UI
  document.getElementById("cityName").innerText = locData[0].LocalizedName;
  document.getElementById("temperature").innerText =
    weather.Temperature.Metric.Value + "°C";
  document.getElementById("description").innerText = weather.WeatherText;

  const iconMap = {
    Sunny: "assets/sunny_day.png",
    Cloudy: "assets/cloudy.png",
    "Partly cloudy": "assets/partly_cloudy.png",
    Rain: "assets/heavy_rain.png",
    Snow: "assets/snowy.png",
  };

  let icon = iconMap[weather.WeatherText] || "assets/cloudy.png";
  document.getElementById("weatherIcon").src = icon;

  document.getElementById("weatherCard").classList.add("show");
}
