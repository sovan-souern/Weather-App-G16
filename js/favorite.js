const loadFavorites = () => JSON.parse(localStorage.getItem("favoriteCities")) || [];
const saveFavorites = (cities) => localStorage.setItem("favoriteCities", JSON.stringify(cities));

const fetchWeather = (city) => {return fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=2H39EZN7WV4RRMZYUM2K2L9K7&contentType=json`) .then(response => {
                if (!response.ok) throw new Error("City not found");
                    return response.json();
                });
};

const renderFavorites = () => {
    const favoriteCities = loadFavorites();
    const favoriteCitiesContainer = document.getElementById("favoriteCities");
    favoriteCitiesContainer.innerHTML = "";

    favoriteCities.forEach(city => {
        const cityCard = document.createElement("div");
        cityCard.className = "favorite-city";

        fetchWeather(city)
            .then(data => {
                cityCard.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <h3>${city}</h3>
                        <button class="delete-btn" data-city="${city}" title="Remove city">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="text-align: left;">
                            <p class="temp">${data.currentConditions.temp}°C</p>
                            <p class="conditions">${data.currentConditions.conditions}</p>
                        </div>
                       
                        <div class="info" style="display: flex; gap: 15px;">
                            <!-- Wind Information -->
                            <div class="card-weather" style="display: flex; flex-direction: column; align-items: center; gap: 5px; background: green; color: white; padding: 10px 20px; border-radius: 8px; width: 120px;">
                                <i class="fas fa-wind" style="font-size: 20px;"></i>
                                <span>${data.currentConditions.windspeed} m/s</span>
                                </p>
                            </div>

                            <!-- Humidity Information -->
                            <div class="card-weather" style="display: flex; flex-direction: column; align-items: center; gap: 5px; background: green; color: white; padding: 10px 20px; border-radius: 8px; width: 120px;">
                                <i class="fas fa-tint" style="font-size: 24px;"></i>
                                    <span>${data.currentConditions.humidity}%</span>
                                </p>
                            </div>
                        </div>


                    </div>
                `;
            })
            .catch(err => {
                cityCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${city}</h3>
                        <button class="delete-btn" data-city="${city}" title="Remove city">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <p>Could not fetch data for ${city}</p>`;
            });

            favoriteCitiesContainer.appendChild(cityCard);
        });

            // Add event listeners to delete buttons
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const cityToRemove = btn.getAttribute("data-city");
                    const updatedCities = favoriteCities.filter(city => city !== cityToRemove);
                    saveFavorites(updatedCities);
                    renderFavorites();
                });
            });
        };

        // Add new favorite city
        document.getElementById("addFavorite").addEventListener("click", () => {
            const cityInput = document.getElementById("cityInput").value.trim();
            if (cityInput) {
                const favoriteCities = loadFavorites();
                const normalizedCity = cityInput.toLowerCase(); // Normalize to avoid duplicates

                if (!favoriteCities.includes(normalizedCity)) {
                    fetchWeather(cityInput)
                        .then(() => {
                            favoriteCities.push(normalizedCity);
                            saveFavorites(favoriteCities);
                            renderFavorites();
                            alert(`${cityInput} added to favorites!`);
                        })
                        .catch(() => alert(`Unable to fetch weather data for "${cityInput}".`));
                } else {
                    alert("City is already in your favorites.");
                }
                document.getElementById("cityInput").value = ""; // Clear input
            } else {
                alert("Please enter a city name.");
            }
        });

        // Initial render
        renderFavorites();