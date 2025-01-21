const btn = document.querySelector('.btn');
const search = document.querySelector('.form-control');
const apiKey = '2f2a46aec436e07080c19fc46c4fc306';
const yourLocation = document.querySelector('.your-location');
const day = document.querySelector('.today');
const temperature = document.querySelector('.temperature');
const feel = document.querySelector('#tep-feel');
const wind = document.querySelector('#wind');
const humiditys = document.getElementById('humidity');
const weatherImg = document.querySelector('.img-weather');
const condition = document.querySelector('#condition');
const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');
const temperatureTime = document.querySelectorAll('#temper');
const timeImg = document.querySelectorAll('.img');
const converter = document.querySelector('#converter');

// Function to convert temperature based on selected unit
function temConverter(temp) {
  const tempValue = Math.round(temp);
  if (converter.value === "°C") {
    return `${tempValue}°C`;
  } else if (converter.value === "°F") {
    const ctof = Math.round((tempValue * 9) / 5 + 32);
    return `${ctof}°F`;
  }
  return tempValue;
}

// Function to get user's geolocation
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// Fetch weather data for a city
async function getFetchDataCity(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Fetch weather data from OpenWeatherMap for user's geolocation
async function getFetchData(endPoint, latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Update weather info based on latitude and longitude
async function updateWeatherInfo(latitude, longitude) {
  try {
    const weatherData = await getFetchData("weather", latitude, longitude);
    const {
      name: country,
      main: { temp, feels_like, humidity },
      weather: [{ id, main }],
      wind: { speed },
      sys: { sunrise: sunriseUnix, sunset: sunsetUnix },
      timezone,
    } = weatherData;

    yourLocation.textContent = country;
    temperature.innerHTML = temConverter(temp);
    feel.innerHTML = temConverter(feels_like);
    wind.textContent = `${speed} m/s`;
    humiditys.textContent = humidity;
    condition.textContent = main;
    weatherImg.src = `../images/${getWeatherIcon(id)}`;

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    sunrise.textContent = formatUnixTime(sunriseUnix, timezone, options);
    sunset.textContent = formatUnixTime(sunsetUnix, timezone, options);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Update weather forecast for the next 8 hours
async function updateWeatherTime(latitude, longitude) {
  try {
    const weatherData = await getFetchData("forecast", latitude, longitude);
    const data = weatherData.list;
    data.forEach((time, index) => {
      if (index < temperatureTime.length) {
        temperatureTime[index].innerHTML = temConverter(time.main.temp);
        timeImg[index].src = `../images/${getWeatherIcon(time.weather[0].id)}`;
        timeImg[index].alt = time.weather[0].description;
      }
    });
  } catch (error) {
    console.error("Error updating weather info:", error.message);
  }
}

// Convert UNIX timestamp to a readable time format
function formatUnixTime(dtValue, offset, options) {
  const date = new Date((dtValue + offset) * 1000);
  return date.toLocaleString([], { timeZone: 'UTC', ...options });
}

// Get weather icon based on the weather condition ID
function getWeatherIcon(id) {
  if (id <= 232) return 'thunderstorm.png';
  if (id <= 321) return 'drizzle.png';
  if (id <= 531) return 'rain.png';
  if (id <= 622) return 'snow.png';
  if (id <= 781) return 'atmosphere.png';
  if (id === 800) return 'clear.png';
  return 'cloud.png';
}

// Display the current date
// Update clock and greeting
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  const isAM = hours < 12;
  hours = hours % 12 || 12; // Convert to 12-hour format
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  document.getElementById("time1").textContent = `${hours}:${minutes} ${isAM ? "AM" : "PM"}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  document.getElementById("date1").textContent = `${dayName}, ${date} ${monthName}, ${year}`;

  // Determine greeting and icon based on the time of day
  let greeting;
  let icon;
  const currentHour = now.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning, Cambodia";
    icon = "🌅"; // Morning icon
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon, Cambodia";
    icon = "☀️"; // Afternoon icon
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good evening, Cambodia";
    icon = "🌇"; // Evening icon
  } else {
    greeting = "Good night, Cambodia";
    icon = "🌙"; // Night icon
  }

  // Set greeting with icon
  document.getElementById("greeting1").innerHTML = `<span class="icon1">${icon}</span> ${greeting}`;
}



// Update weather info for a city
async function updateWeatherInfoCity(city) {
  try {
    const weatherData = await getFetchDataCity("weather", city);
    const {
      name: country,
      main: { temp, feels_like, humidity },
      weather: [{ id, main }],
      wind: { speed },
      sys: { sunrise: sunriseUnix, sunset: sunsetUnix },
      timezone,
    } = weatherData;

    yourLocation.textContent = country;
    temperature.innerHTML = temConverter(temp);
    feel.innerHTML = temConverter(feels_like);
    wind.textContent = `${speed} m/s`;
    humiditys.textContent = humidity;
    condition.textContent = main;
    weatherImg.src = `../images/${getWeatherIcon(id)}`;

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    sunrise.textContent = formatUnixTime(sunriseUnix, timezone, options);
    sunset.textContent = formatUnixTime(sunsetUnix, timezone, options);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Update weather forecast for the next 8 hours for a city
async function updateWeatherTimeCity(city) {
  try {
    const weatherData = await getFetchDataCity("forecast", city);
    const data = weatherData.list;
    data.forEach((time, index) => {
      if (index < temperatureTime.length) {
        temperatureTime[index].innerHTML = temConverter(time.main.temp);
        timeImg[index].src = `../images/${getWeatherIcon(time.weather[0].id)}`;
        timeImg[index].alt = time.weather[0].description;
      }
    });
  } catch (error) {
    console.error("Error updating weather info:", error.message);
  }
}

// Event listeners for city search and weather update
btn.addEventListener('click', () => {
  if (search.value.trim() !== '') {
    updateWeatherInfoCity(search.value);
    updateWeatherTimeCity(search.value);
    search.value = '';
    search.blur();
  }
});

search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && search.value.trim() !== '') {
    updateWeatherInfoCity(search.value);
    updateWeatherTimeCity(search.value);
    search.value = '';
    search.blur();
  }
});

converter.addEventListener('change', main); // Re-fetch weather info when temperature unit is changed

// Initialize the app for user's location
async function main() {
  try {
    const { latitude, longitude } = await getLocation();
    await updateWeatherInfo(latitude, longitude);
    await updateWeatherTime(latitude, longitude);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update the time every second
setInterval(updateClock, 1000);

// Initialize the app
// function
main();
showDate();

// funtion to get weather at time specified
function formatTime(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour} ${period}`;
}

// Get the current time
const currentTime = new Date();
let currentHour = currentTime.getHours();

// Array to hold the next times
const times = [];

// Loop to generate the next available times in 3-hour intervals, excluding current and next 3 hours
for (let i = 0; i <= 7; i++) {
  let futureHour = (currentHour + i * 3) % 24;  // Calculate the hour for the next time slot
  times.push(formatTime(futureHour));  // Format the time and add it to the array
}
console.log(times); 
const nextHour = document.querySelectorAll('#hour');
console.log(nextHour);
// Display the times in the list

nextHour.forEach((time, index) => {
  time.textContent = times[index];
});
