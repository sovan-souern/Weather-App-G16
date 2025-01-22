const calendar = document.querySelector('.calendar');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentMonth = new Date().getMonth(); // Start with the current month
let currentYear = new Date().getFullYear();

const API_KEY = "d32e7a65c1d759f27e5eeaef3ca69dfc"; // Replace with your OpenWeatherMap API key
const LOCATION = "Cambodia"; // Replace with your desired location

// Update the month and year title
function updateMonthYear() {
  monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' })} ${currentYear}`;
}

// Fetch weather data from API or localStorage
async function fetchWeather() {
  // Check if weather data is in localStorage
  const cachedWeather = localStorage.getItem("weatherData");
  const cachedTimestamp = localStorage.getItem("weatherTimestamp");

  // Use cached data if it's less than 1 hour old
  if (cachedWeather && cachedTimestamp) {
    const age = (Date.now() - parseInt(cachedTimestamp)) / (1000 * 60 * 60);
    if (age < 1) {
      console.log("Using cached weather data.");
      return JSON.parse(cachedWeather);
    }
  }

  // Fetch new data if not cached or cache is expired
  try {
    console.log("Fetching new weather data...");
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${LOCATION}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const weatherData = data.list.map((entry) => ({
      icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
      alt: entry.weather[0].description,
      temp: `${Math.round(entry.main.temp_max)}°C | ${Math.round(entry.main.temp_min)}°C`,
    }));

    // Save new data to localStorage
    localStorage.setItem("weatherData", JSON.stringify(weatherData));
    localStorage.setItem("weatherTimestamp", Date.now().toString());

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null; // Return null in case of error
  }
}

// Render the calendar
async function renderCalendar() {
  calendar.innerHTML = '';
  updateMonthYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const weatherData = await fetchWeather(); // Fetch weather data

  if (!weatherData) {
    calendar.innerHTML = '<p>Unable to fetch weather data. Please try again later.</p>';
    return;
  }

  // Create empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day');
    calendar.appendChild(emptyCell);
  }

  // Create day cells with weather data
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    // Rotate through weather data (or fetch by date if API provides exact date weather)
    const weather = weatherData[day % weatherData.length];

    dayCell.innerHTML = `
      <div>${day}</div>
      <img src="${weather.icon}" alt="${weather.alt}">
      <div class="temp-range">${weather.temp}</div>
    `;
    calendar.appendChild(dayCell);
  }
}


// Update the details display using SweetAlert (without time)
function updateDetails(day, weather) {
  const selectedDate = new Date(currentYear, currentMonth, day);
  const formattedDate = selectedDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  Swal.fire({
    title: 'Day Details',
    html: `
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Temperature:</strong> ${weather.temp}</p>
      <img src="${weather.icon}" alt="${weather.alt}" style="width:50px; margin-top: 10px;">
    `,
    icon: 'info',
    confirmButtonText: 'Close',
  });
}

// Render the calendar
async function renderCalendar() {
  calendar.innerHTML = '';
  updateMonthYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const weatherData = await fetchWeather(); // Fetch weather data

  if (!weatherData) {
    calendar.innerHTML = '<p>Unable to fetch weather data. Please try again later.</p>';
    return;
  }

  // Create empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day');
    calendar.appendChild(emptyCell);
  }

  // Create day cells with weather data
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    // Rotate through weather data (or fetch by date if API provides exact date weather)
    const weather = weatherData[day % weatherData.length];

    dayCell.innerHTML = `
      <div>${day}</div>
      <img src="${weather.icon}" alt="${weather.alt}">
      <div class="temp-range">${weather.temp}</div>
    `;

    // Add click event to display details
    dayCell.addEventListener('click', () => {
      updateDetails(day, weather);
    });

    calendar.appendChild(dayCell);
  }
}

// Event listeners for navigating months
prevButton.addEventListener('click', () => {
  currentMonth = (currentMonth - 1 + 12) % 12;
  if (currentMonth === 11) currentYear--;
  renderCalendar();
});

nextButton.addEventListener('click', () => {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  renderCalendar();
});

// Initial render
renderCalendar();

