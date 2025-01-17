function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear previous calendar

    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
        calendar.innerHTML += '<div class="day"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendar.innerHTML += `
            <div class="day">
                <h4>${day}</h4>
                <div class="weather-icon">☀️</div>
                <p>High: ${Math.floor(Math.random() * (95 - 80 + 1) + 80)}°F</p>
                <p>Low: ${Math.floor(Math.random() * (75 - 65 + 1) + 65)}°F</p>
                <p>Rain: 0 in</p>
            </div>
        `;
    }
}

// Initial load
generateCalendar();


