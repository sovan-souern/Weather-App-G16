const map = L.map("map").setView([11.5564, 104.9282], 6); // Center on Phnom Penh, Cambodia

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const apiKey = "2f2a46aec436e07080c19fc46c4fc306"; // Replace with your OpenWeatherMap API key

async function fetchWeatherData(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network response was not okay.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

function displayWeatherData(lat, lng, weatherData) {
  const { name, main, weather } = weatherData;
  const temperature = main.temp;
  const weatherDescription = weather[0].description;
  const icon = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  L.marker([lat, lng], { icon: weatherIcon })
    .addTo(map)
    .bindPopup(`
      <strong>${name}</strong><br>
      Temperature: ${temperature}°C<br>
      Weather: ${weatherDescription}
    `);
}

async function handleMapClick(e) {
  const { lat, lng } = e.latlng;
  const weatherData = await fetchWeatherData(lat, lng);
  if (weatherData) {
    displayWeatherData(lat, lng, weatherData);
  } else {
    alert("Failed to fetch weather data for this location.");
  }
}

async function searchPlace() {
  const place = document.getElementById("searchInput").value.trim();
  if (!place) {
    alert("Please enter a place name.");
    return;
  }

  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${apiKey}`;
  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) throw new Error("Geocoding API error.");
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon, name } = data[0];
      map.setView([lat, lon], 10);
      const weatherData = await fetchWeatherData(lat, lon);
      if (weatherData) {
        displayWeatherData(lat, lon, weatherData);
      } else {
        alert("Failed to fetch weather data for this location.");
      }
    } else {
      alert("Place not found. Please try again.");
    }
  } catch (error) {
    console.error("Error searching for place:", error.message);
    alert("Error searching for place. Please try again.");
  }
}

async function updateWeatherIcons() {
  const bounds = map.getBounds();
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();

  for (let lat = southWest.lat; lat <= northEast.lat; lat += 5) {
    for (let lng = southWest.lng; lng <= northEast.lng; lng += 5) {
      const weatherData = await fetchWeatherData(lat, lng);
      if (weatherData) {
        displayWeatherData(lat, lng, weatherData);
      }
    }
  }
}

map.on("click", handleMapClick);
map.on("moveend", updateWeatherIcons);
map.on("zoomend", updateWeatherIcons);

updateWeatherIcons();