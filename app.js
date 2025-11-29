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

  try {
    // Call backend endpoint (CORS-safe)
    const res = await fetch(`/weather?city=${city}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    // Update UI
    document.getElementById("cityName").innerText = city;
    document.getElementById("temperature").innerText =
      data.Temperature.Metric.Value + "°C";
    document.getElementById("description").innerText = data.WeatherText;

    const iconMap = {
      Sunny: "assets/sunny_day.png",
      Cloudy: "assets/cloudy.png",
      "Partly cloudy": "assets/partly_cloudy.png",
      Rain: "assets/heavy_rain.png",
      Snow: "assets/snowy.png",
    };

    let icon = iconMap[data.WeatherText] || "assets/cloudy.png";
    document.getElementById("weatherIcon").src = icon;

    document.getElementById("weatherCard").classList.add("show");
  } catch (err) {
    alert("Failed to fetch weather. Check your server.");
    console.error(err);
  }
}
