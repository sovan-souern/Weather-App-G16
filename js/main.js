const btn = document.querySelector('.btn')
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

function getLocation() {
    // Return a Promise that resolves with the latitude and longitude
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude }); // Resolve the Promise with the coordinates
          },
          (error) => {
            reject(error); // Reject the Promise if there is an error
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
async function getFetchDataUser(endPoint, latitude, longitude){
    const apiUrl= `https://api.openweathermap.org/data/2.5/${endPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}
getLocation()
  .then(({ latitude, longitude }) => {
    console.log("Latitude:", latitude, "Longitude:", longitude);
    return getFetchDataUser("weather", latitude, longitude); // Call getFetchData with the coordinates
  })
  .then((data) => {
    console.log("Weather data:", data); // Log the fetched weather data
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  async function updateWeatherInfoUser(latitude, longitude){
    const weatherData = await getFetchDataUser("weather", latitude, longitude)
    const { 
        name: country,
        main: {temp, feels_like, humidity },
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


}
async function main() {
  try {
    const { latitude, longitude } = await getLocation(); // Get the user's location
    await updateWeatherInfoUser(latitude, longitude); // Update weather information
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the main function
main();
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
    console.log(endPoint)

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
async function updateWeatherInfo(city) {
    try {
        const weatherData = await getFetchData("weather", city);

        // Check if the response contains an error
        if (weatherData.cod != 200) {
            Swal.fire({
                title: "Location not found!",
                icon: "error",
                text: "Please enter a valid city name.",
            });
            return; // Exit the function if there's an error
        }

        // Destructure the weather data
        const {
            name: country,
            main: { temp, feels_like, humidity },
            weather: [{ id, main }],
            wind: { speed },
        } = weatherData;

        // Update the UI with valid weather data
        yourlocation.textContent = country;
        temperature.textContent = Math.round(temp) + "°C";
        feel.textContent = Math.round(feels_like) + "°C";
        wind.textContent = speed + " m/s";
        humiditys.textContent = humidity;
        condition.textContent = main;
        weatherImg.src = `images/${getWeatherIcon(id)}`;

        console.log("Weather data:", weatherData);
    } catch (error) {
        // Catch network or other unexpected errors
        Swal.fire({
            title: "Error!",
            icon: "error",
            text: "An error occurred while fetching the weather data. Please try again later.",
        });
        console.error("Error fetching weather data:", error);
    }
}

