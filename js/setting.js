const darkMode = document.getElementById('dark-mode')
darkMode.addEventListener('change', function () {
  const darkModeText = document.getElementById('dark-mode-text');
  const arrowButton = document.getElementsByClassName('arrow-button');
  if (this.checked) {
    // Enable Dark Mode
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#fff';
    darkModeText.textContent = 'Dark Mode'; // Update text
    Array.from(arrowButton).forEach((button) => {
      button.style.color = '#fff';
    });
  } else {
    // Enable Light Mode
    document.body.style.backgroundColor = '#f0f0f0';
    document.body.style.color = '#000';
    darkModeText.textContent = 'Light Mode'; // Update text
    Array.from(arrowButton).forEach((button) => {
      button.style.color = '#000';
    });
  }
});
// Function to get user's location
function fetchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Update the location display
        document.getElementById('location').textContent = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      },
      function (error) {
        // Handle errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            document.getElementById('location').textContent = "Permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            document.getElementById('location').textContent = "Position unavailable";
            break;
          case error.TIMEOUT:
            document.getElementById('location').textContent = "Request timeout";
            break;
          default:
            document.getElementById('location').textContent = "Unknown error";
        }
      }
    );
  } else {
    document.getElementById('location').textContent = "Geolocation not supported";
  }
}

// Call the function to fetch the locatio
fetchLocation();
