// MoodTunes JavaScript (WeatherAPI.com version)
// --- CONFIG ---
const WEATHERAPI_KEY = '8b6a038a5cc3474aa84233023252305'; // <-- Replace with your WeatherAPI.com API key

// --- Mood mapping based on weather condition text ---
const weatherToMood = {
  Sunny: { mood: 'Happy', genre: 'Pop', class: 'mood-happy', playlist: '37i9dQZF1DXdPec7aLTmlC' },
  Clear: { mood: 'Happy', genre: 'Pop', class: 'mood-happy', playlist: '37i9dQZF1DXdPec7aLTmlC' },
  Cloudy: { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' },
  Overcast: { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' },
  Rain: { mood: 'Calm', genre: 'Acoustic', class: 'mood-calm', playlist: '37i9dQZF1DXbvABJXBIyiY' },
  Drizzle: { mood: 'Calm', genre: 'Acoustic', class: 'mood-calm', playlist: '37i9dQZF1DXbvABJXBIyiY' },
  Thunder: { mood: 'Energetic', genre: 'Rock', class: 'mood-energetic', playlist: '37i9dQZF1DX1tyCD9QhIWF' },
  Snow: { mood: 'Cozy', genre: 'Jazz', class: 'mood-cozy', playlist: '37i9dQZF1DWUNIrSzKgQbP' },
  Mist: { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' },
  Fog: { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' },
  Haze: { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' },
};

// --- DOM Elements ---
const welcomeScreen = document.getElementById('welcome-screen');
const moodScreen = document.getElementById('mood-screen');
const homeScreen = document.getElementById('home-screen');
const useLocationBtn = document.getElementById('use-location');
const submitCityBtn = document.getElementById('submit-city');
const cityInput = document.getElementById('city-input');
const tryAnotherBtn = document.getElementById('try-another');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const temperature = document.getElementById('temperature');
const moodLabel = document.getElementById('mood');
const playlistContainer = document.getElementById('playlist-container');

// --- Event Listeners ---
useLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      err => showError('Location access denied. Please enter a city.')
    );
  } else {
    showError('Geolocation not supported. Please enter a city.');
  }
});

submitCityBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

tryAnotherBtn.addEventListener('click', () => {
  showWelcomeScreen();
});

// --- Functions ---
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}`)
    .then(res => res.json())
    .then(data => handleWeatherData(data))
    .catch(() => showError('Failed to fetch weather.'));
}

function fetchWeatherByCity(city) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => handleWeatherData(data))
    .catch(() => showError('Failed to fetch weather.'));
}

function handleWeatherData(data) {
  if (!data.current || !data.current.condition) {
    showError('Could not get weather for this location.');
    return;
  }
  const conditionText = data.current.condition.text;
  const temp = Math.round(data.current.temp_c);
  const icon = data.current.condition.icon;
  // Find a mapping by checking if the condition text contains a known key
  let mapping = { mood: 'Chill', genre: 'Indie', class: 'mood-chill', playlist: '37i9dQZF1DX4WYpdgoIcn6' };
  for (const key in weatherToMood) {
    if (conditionText.toLowerCase().includes(key.toLowerCase())) {
      mapping = weatherToMood[key];
      break;
    }
  }

  // Set mood background
  document.body.className = mapping.class;

  // Set weather info
  weatherIcon.src = icon.startsWith('//') ? 'https:' + icon : icon;
  weatherDesc.textContent = conditionText;
  temperature.textContent = `${temp}°C`;
  moodLabel.textContent = mapping.mood;

  // Show genre
  let genreElem = document.getElementById('genre-label');
  if (!genreElem) {
    genreElem = document.createElement('div');
    genreElem.id = 'genre-label';
    genreElem.style.textAlign = 'center';
    genreElem.style.fontWeight = 'bold';
    genreElem.style.margin = '10px 0';
    moodLabel.parentNode.parentNode.insertBefore(genreElem, playlistContainer);
  }
  genreElem.textContent = `Genre: ${mapping.genre}`;

  // Set playlist
  playlistContainer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${mapping.playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;

  showMoodScreen();
}

function showWelcomeScreen() {
  moodScreen.style.display = 'none';
  welcomeScreen.style.display = 'block';
  document.body.className = '';
  cityInput.value = '';
}

function showMoodScreen() {
  welcomeScreen.style.display = 'none';
  moodScreen.style.display = 'block';
}

function showHomeScreen() {
  homeScreen.style.display = 'block';
  welcomeScreen.style.display = 'none';
  moodScreen.style.display = 'none';
  document.body.className = '';
  cityInput.value = '';
}

function showError(msg) {
  alert(msg);
}

// On load, show home screen
showHomeScreen();
