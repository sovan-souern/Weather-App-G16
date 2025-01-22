document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");
  const calendarContainer = document.getElementById("calendar");

  // Sample weather data for demonstration
  const weatherData = [
      { icon: "https://cdn-icons-png.flaticon.com/128/3222/3222801.png", alt: "Partly Cloudy", temp: "88°F | 77°F", rainfall: "0 in" },
      { icon: "https://cdn-icons-png.flaticon.com/128/2698/2698213.png", alt: "Sunny", temp: "90°F | 75°F", rainfall: "0 in" },
      { icon: "https://cdn-icons-png.flaticon.com/128/2337/2337478.png", alt: "Rainy", temp: "85°F | 72°F", rainfall: "1.2 in" },
      // Add more sample data as needed
  ];

  const displayCalendar = () => {
      const month = parseInt(monthSelect.value);
      const year = parseInt(yearSelect.value);

      // Clear previous calendar content
      calendarContainer.innerHTML = "";

      // Get the number of days in the selected month
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
          const dayDiv = document.createElement("div");
          dayDiv.className = "calendar-day";

          const dayNumber = document.createElement("div");
          dayNumber.className = "day-number";
          dayNumber.textContent = day;

          // Create weather elements
          const weather = weatherData[day % weatherData.length]; // Rotate through sample data
          const weatherIcon = document.createElement("img");
          weatherIcon.className = "weather-icon";
          weatherIcon.src = weather.icon;
          weatherIcon.alt = weather.alt;

          const temperature = document.createElement("div");
          temperature.className = "temperature";
          temperature.textContent = weather.temp;

          const rainfall = document.createElement("div");
          rainfall.className = "rainfall";
          rainfall.textContent = weather.rainfall;

          // Append elements to the day div
          dayDiv.appendChild(dayNumber);
          dayDiv.appendChild(weatherIcon);
          dayDiv.appendChild(temperature);
          dayDiv.appendChild(rainfall);

          // Append the day div to the calendar container
          calendarContainer.appendChild(dayDiv);
      }
  };

  // Add event listeners for dropdown changes
  monthSelect.addEventListener("change", displayCalendar);
  yearSelect.addEventListener("change", displayCalendar);
  
  // Add event listener for clicking on a day
  calendarContainer.addEventListener("click", function (event) {
      if (event.target.className === "calendar-day") {
          
          
      }
  });

  // Initial render
  displayCalendar();
});
// Function to update weather details

