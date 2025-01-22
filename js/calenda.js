
document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");
    const calendarContainer = document.getElementById("calendar");
    const converter = document.getElementById("converter");

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

    // Fetch weather data for a city
    const API_KEY = 'd32e7a65c1d759f27e5eeaef3ca69dfc'; // Replace with your OpenWeatherMap API key
    const CITY = 'Cambodia'; // Replace with your city
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&cnt=30&appid=${API_KEY}`; // Use 'metric' for Celsius

    // Fetch weather data from the API
    const fetchWeatherData = async () => {
        try {
            const response = await fetch(WEATHER_URL);
            const data = await response.json();
            return data.list; // Return the list of forecasts (adjust as needed)
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const displayCalendar = async () => {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        // Clear previous calendar content
        calendarContainer.innerHTML = "";

        // Get the number of days in the selected month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fetch weather data
        const weatherData = await fetchWeatherData();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.className = "calendar-day";
            dayDiv.setAttribute('data-day', day); // Store the day in a data attribute

            const dayNumber = document.createElement("div");
            dayNumber.className = "day-number";
            dayNumber.textContent = day;

            // Get the weather data for the current day (adjust this based on your API's data structure)
            const weather = weatherData[day % weatherData.length]; // Rotate through the forecast data
            const weatherIcon = document.createElement("img");
            weatherIcon.className = "weather-icon";
            weatherIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
            weatherIcon.alt = weather.weather[0].description;

            const temperature = document.createElement("div");
            temperature.className = "temperature";
            temperature.textContent = `${weather.main.temp}°C`; // Display temperature in Celsius

            const rainfall = document.createElement("div");
            rainfall.className = "rainfall";
            rainfall.textContent = `${weather.rain ? weather.rain['3h'] : '0'} mm`; // Display rainfall in mm

            // Append elements to the day div
            dayDiv.appendChild(dayNumber);
            dayDiv.appendChild(weatherIcon);
            dayDiv.appendChild(temperature);
            dayDiv.appendChild(rainfall);

            // Add an event listener to the day div to display the date and temperature using SweetAlert
            dayDiv.addEventListener("click", () => {
                displaySelectedDateInfo(day, month, year + 1, weather.main.temp);
            });

            // Append the day div to the calendar container
            calendarContainer.appendChild(dayDiv);
        }
    };

    // Function to display selected date information using SweetAlert
    const displaySelectedDateInfo = (day, month, year, temp) => {
        // Convert the month number to a month name
        const months = [
            "January", "February", "March", "April", "May", "June", "July", 
            "August", "September", "October", "November", "December"
        ];
        const monthName = months[month]; // Get the month name from the array

        // Show SweetAlert popup
        Swal.fire({
            title: `Selected Date: ${day} ${monthName} ${year}`,
            text: `Temperature: ${temConverter(temp)}`,
            icon: 'info',
            confirmButtonText: 'Ok'
        });
    };

    // Add event listeners for dropdown changes
    monthSelect.addEventListener("change", displayCalendar);
    yearSelect.addEventListener("change", displayCalendar);

    // Populate the year dropdown dynamically
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 30;  // Starting from 30 years ago
    const endYear = currentYear;  // Until the current year

    // Populate the year select element with options
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;  // Set current year as default

    // Initial render
    displayCalendar();
});