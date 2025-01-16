const btn = document.querySelector('.btn')
// btn.addEventListener('click', () => {
//     Swal.fire({
//         title: "This location is not found!",
//         icon: "error",
//         text: "Please find other location.",
//     });
// });

const search = document.querySelector('.form-control')
const apiKey = '2f2a46aec436e07080c19fc46c4fc306';
const yourlocation = document.querySelector('.your-location');
const day = document.querySelector('.today');
const temperature = document.querySelector('.temperature');
const feel = document.querySelector('#tep-feel');
const wind = document.querySelector('#wind');
const humiditys = document.getElementById('humidity');
const weatherImg = document.querySelector('.img-weather');
const condition = document.querySelector('#condition');
console.log(weatherImg);

btn.addEventListener('click', () => {
    if(search.value.trim()!= ''){
        updateWeatherInfo(search.value)
        search.value = ''
        search.blur();
    }
});
search.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && search.value.trim() != ''
){
    updateWeatherInfo(search.value)
    search.value = ''
    search.blur();
}
});
async function getFetchData(endPoint, city){
    const apiUrl= `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)

    return response.json()
}
function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.png'
    if (id <= 321) return 'drizzle.png'
    if (id <= 531) return 'rain.png'
    if (id <= 622) return 'snow.png'
    if (id <= 781) return 'atmosphere.png'
    if (id <= 800) return 'clear.png'
    else return 'cloud.png' 
}
function showDate() {
    const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
  ];

  let today = new Date();
          let date = today.getDate();
          let monthIndex= today.getMonth();
          let year = today.getFullYear();
          day.textContent = date + " " + months[monthIndex] + " " + year;
}
showDate()
const date = new Date()
async function updateWeatherInfo(city){
    const weatherData = await getFetchData("weather", city)
    const { 
        name: country,
        main: { temp, feels_like, humidity },
        weather: [{ id, main }],
        wind: {speed},

    } = weatherData;
    yourlocation.textContent = country;
    temperature.textContent = Math.round(temp)+'°C';
    feel.textContent = Math.round(feels_like)+'°C';
    wind.textContent = speed+' m/s';
    humiditys.textContent = humidity;
    condition.textContent = main;
    weatherImg.src = `images/${getWeatherIcon(id)}`;

    console.log(weatherData)

    if (weatherData.cod != 200){
        btn.addEventListener('click', () => {
            Swal.fire({
                title: "This location is not found!",
                icon: "error",
                text: "Please find other location.",
            });
        });
    }
}
// This script dynamically updates the weather data if required
const weatherData = [
    { day: "Monday", icon: "🌤", temp: "70° / 25°" },
    { day: "Tuesday", icon: "⛅️", temp: "48° / 60°" },
    { day: "Wednesday", icon: "☁️", temp: "55° / 38°" },
    { day: "Thursday", icon: "🌥", temp: "25° / 40°" },
    { day: "Friday", icon: "🌤", temp: "65° / 33°" },
    { day: "Saturday", icon: "⛅️", temp: "34° / 27°" },
    { day: "Sunday", icon: "☁️", temp: "29° / 55°" }
  ];
  
  const weatherForecastContainer = document.querySelector('.weather-forecast');
  
  function updateWeather() {
    const days = document.querySelectorAll('.day');
    days.forEach((dayElement, index) => {
      const { day, icon, temp } = weatherData[index];
      dayElement.querySelector('.day-name').textContent = day;
      dayElement.querySelector('.weather-icon').textContent = icon;
      dayElement.querySelector('.temperature').textContent = temp;
    });
  }
  
  // Run when the page loads
  updateWeather();