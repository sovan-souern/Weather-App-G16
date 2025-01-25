const btn = document.querySelector('#search');
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
const dayNames = document.querySelectorAll('.day-name');
// const tempDays = document.querySelectorAll('.temp');
const date = document.querySelectorAll('#date');
console.log(dayNames)

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
  day.textContent = `${dayName}, ${date} ${monthName}, ${year}`;

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
    fetchWeatherCity(search.value);
    search.value = '';
    search.blur();
  }
});

search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && search.value.trim() !== '') {
    updateWeatherInfoCity(search.value);
    updateWeatherTimeCity(search.value);
    fetchWeatherCity(search.value);
    search.value = '';
    search.blur();
  }
});

converter.addEventListener('change', () => {
  if (yourLocation.textContent.trim() !== '') {
    updateWeatherInfoCity(yourLocation.textContent);
    updateWeatherTimeCity(yourLocation.textContent);
    fetchWeatherCity(yourLocation.textContent);
    

  } else {
    getLocation()
      .then(({ latitude, longitude }) => {
        updateWeatherInfo(latitude, longitude);
        updateWeatherTime(latitude, longitude);
        fetchWeather(latitude, longitude);
      })
      .catch(error => console.error('Error:', error));
  }
});
 // Re-fetch weather info when temperature unit is changed

// Initialize the app for user's location
async function main() {
  try {
    const { latitude, longitude } = await getLocation();
    await updateWeatherInfo(latitude, longitude);
    await updateWeatherTime(latitude, longitude);
    await fetchWeather(latitude, longitude);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Update the time every second
setInterval(updateClock, 1000);

// Initialize the app
// function
main();

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

// Update the weather forecast for the next 5 days
const nextDay = [];
const fullDates = [];
console.log(nextDay)

function displayDates() {
  const dateList = document.getElementById("dateList");
  const today = new Date();

  for (let i = 0; i < 6; i++) {
      let futureDate = new Date();
      futureDate.setDate(today.getDate() + i);

      // Extract day and full date separately
      let day = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
      let fullDate = futureDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      nextDay.push(day);
      fullDates.push(fullDate);
  }
}

// Call the function when the page loads
displayDates();

dayNames.forEach((day, index) => {
  day.textContent = nextDay[index];
})

date.forEach((date, index) => {
  date.textContent = fullDates[index];
})


// const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=11.5369379&lon=104.8987471&appid=2f2a46aec436e07080c19fc46c4fc306&units=metric';

async function fetchWeather(latitude, longitude) {
    try {
        // const response = await fetch(apiUrl);
        const data = await getFetchData("forecast", latitude, longitude);
        
        const dailyTemps = {};

        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]; // Extract date part
            const tempMax = item.main.temp_max;
            const tempMin = item.main.temp_min;
            const iconCode = item.weather[0].icon;

            if (!dailyTemps[date]) {
                dailyTemps[date] = { max: tempMax, min: tempMin, icon: iconCode };
            } else {
                dailyTemps[date].max = Math.max(dailyTemps[date].max, tempMax);
                dailyTemps[date].min = Math.min(dailyTemps[date].min, tempMin);
            }
        });

        displayWeather(dailyTemps);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


const minMax = [];
const icons = [];
function displayWeather(dailyTemps) {
    for (const [date, temps] of Object.entries(dailyTemps)) {
        const weatherInfo = `${temConverter(temps.max.toFixed(1))} / ${temConverter(temps.min.toFixed(1))}`;
        const icon = `https://openweathermap.org/img/wn/${temps.icon}@2x.png`;
        minMax.push(weatherInfo);
        icons.push(icon);
    }

    // Update the DOM after data is ready
    const tempDays = document.querySelectorAll('.temp');
    const iconWeather = document.querySelectorAll('.weather-icon');
    tempDays.forEach((temp, index) => {
        if (minMax[index]) {
            temp.textContent = minMax[index];
        }
    });
    iconWeather.forEach((icon, index) => {
        if (icons[index]) {
            icon.src = icons[index];
            icon.style.width='35px'
        }
    });
}

// fetchWeather(latitude, longitude);
// Function to fetch and display weather forecast for the next 5 days for a city
async function fetchWeatherCity(city) {
  try {
    // Clear previous data before updating UI
    document.querySelectorAll('.weather-icon img').forEach(img => img.remove());
    minMax.length = 0;
    icons.length = 0;

    // Fetch weather data from OpenWeatherMap API
    const data = await getFetchDataCity("forecast", city);

    if (!data || !data.list) {
      throw new Error("Invalid data received from API");
    }

    const dailyTemps = {};

    // Process forecast data to get max/min temps for each day
    data.list.forEach(item => {
      if (item && item.main && item.weather && item.dt_txt) {
        const date = item.dt_txt.split(' ')[0]; // Extract date part
        const tempMax = item.main.temp_max;
        const tempMin = item.main.temp_min;
        const iconCode = item.weather[0].icon;

        if (!dailyTemps[date]) {
          dailyTemps[date] = { max: tempMax, min: tempMin, icon: iconCode };
        } else {
          dailyTemps[date].max = Math.max(dailyTemps[date].max, tempMax);
          dailyTemps[date].min = Math.min(dailyTemps[date].min, tempMin);
        }
      }
    });

    displayWeather(dailyTemps);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    Swal.fire({
      title: "This location is not found!",
      icon: "error",
      text: "Please find other location.",
    });
  }
}

// Function to update the UI with weather data
function displayWeather(dailyTemps) {
  for (const [date, temps] of Object.entries(dailyTemps)) {
    const weatherInfo = `${temConverter(temps.max.toFixed(1))} / ${temConverter(temps.min.toFixed(1))}`;
    const icon = `https://openweathermap.org/img/wn/${temps.icon}@2x.png`;
    minMax.push(weatherInfo);
    icons.push(icon);
  }

  // Update the DOM after data is ready
  const tempDays = document.querySelectorAll('.temp');
  const iconWeather = document.querySelectorAll('.weather-icon');

  tempDays.forEach((temp, index) => {
    if (minMax[index]) {
      temp.textContent = minMax[index];
    }
  });

  iconWeather.forEach((icon, index) => {
    if (icons[index]) {
      icon.src = icons[index];
      icon.style.width = '35px';
    }
  });
}

function formatTime(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour} ${period}`;
}

// Generate fixed time labels starting from 7AM
function generateTimeLabels() {
  const fixedHours = [7, 10, 13, 16, 19, 22, 1, 4]; // 24-hour format
  return fixedHours.map(hour => formatTime(hour));
}

// Fetch weather data and update the chart
async function fetchWeatherDataAndUpdateChart() {
  const apiKey = 'd32e7a65c1d759f27e5eeaef3ca69dfc'; // Replace with your API key
  const city = 'Cambodia'; // Replace with your desired city
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const temperatures = data.list.slice(0, 8).map(item => item.main.temp);
    const labels = generateTimeLabels();

    updateChart(labels, temperatures);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function formatTime(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour} ${period}`;
}

// Generate the next 8 times in 3-hour intervals
function generateTimeLabels() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const times = [];

  for (let i = 1; i <= 8; i++) { // Generate the next 8 time slots
    let futureHour = (currentHour + i * 3) % 24;
    times.push(formatTime(futureHour));
  }

  return times;
}

// Fetch weather data and update the chart
async function fetchWeatherDataAndUpdateChart() {
  const apiKey = 'd32e7a65c1d759f27e5eeaef3ca69dfc'; // Replace with your API key
  const city = 'Korea'; // Replace with your city
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const temperatures = data.list.slice(0, 8).map(item => item.main.temp);
    const labels = generateTimeLabels();

    updateChart(labels, temperatures);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Update Chart.js with new data
function updateChart(labels, temperatures) {
  const data = {
    labels: labels,
    datasets: [{
      label: "Temperature (°C)",
      data: temperatures,
      borderColor: "#fbc02d",
      backgroundColor: "rgba(251, 192, 45, 0.5)",
      tension: 0.3,
      pointBackgroundColor: "#f57c00",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      fill: true
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Time: ${context.label}, Temperature: ${context.raw}°C`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          suggestedMin: 0,
          suggestedMax: 40
        }
      }
    }
  };

  const ctx = document.getElementById('temperatureChart').getContext('2d');
  new Chart(ctx, config);
}

// Fetch weather data and update the chart on page load
fetchWeatherDataAndUpdateChart();