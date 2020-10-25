import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';
import * as appClusterStorage from 'app-cluster-storage';

/* Save cluster storage */
function setClusterStorage(data) {
  const cluster = appClusterStorage.get('my.alphabet.cluster');
  if (cluster !== null) {
    cluster.setItem('letter', data.letter);
  } else {
    console.error('App Cluster Storage is unavailable.');
  }
}

/* Settings */
function sendSettings() {
  const settings = {
    items: settingsStorage.getItem('items') ? JSON.parse(settingsStorage.getItem('items')).map((item) => ({
      name: item.name ? JSON.parse(item.name).name : '',
      letter: item.letter ? JSON.parse(item.letter).value : '',
      color: item.color ? JSON.parse(item.color) : '',
    })) : [],
    list: settingsStorage.getItem('list') ? JSON.parse(settingsStorage.getItem('list')).map((item) => item.value) : [],
    letter: settingsStorage.getItem('letter') ? JSON.parse(settingsStorage.getItem('letter')).values[0].value : '',
  };

  setClusterStorage(settings);

  outbox.enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* Sending short messages */
function sendMessage() {
  const data = {
    companionTimestamp: new Date().getTime(),
  };

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

messaging.peerSocket.addEventListener('open', () => {
  setInterval(sendMessage, 10000);
});

messaging.peerSocket.addEventListener('error', (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

/* API Fetch */
function fetchWeather(coords) {
  const API_KEY = 'your-key-here';
  const UNITS = 'metric'; // This should be a setting in your settings as, there is no Fitbit defined °C / °F user-setting
  const URL = `https://api.openweathermap.org/data/2.5/weather?units=${UNITS}&lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`;

  fetch(URL)
    .then((response) => {
      response.json()
        .then((data) => {
          // We just want the current temperature
          const weather = {
            temperature: data.main.temp,
          };

          console.log(weather);

          outbox.enqueue('weather.cbor', cbor.encode(weather))
            .then(() => console.log('weather sent'))
            .catch((error) => console.log(`send error: ${error}`));
        });
    })
    .catch((err) => {
      console.error(`Error fetching weather: ${err}`);
      // Handle error and send error to device
    });
}

/* Location functions */
function locationSuccess(location) {
  fetchWeather(location.coords);
}

function locationError(error) {
  console.log(`Error: ${error.code}`, `Message: ${error.message}`);
  // Handle location error (send message to device to show error)
}

/* handle device messages */
function processMessaging(evt) {
  console.log(evt.data);
  switch (evt.data.command) {
    case 'weather':
      geolocation.getCurrentPosition(locationSuccess, locationError);
      break;
    default:
      //
      break;
  }
}

messaging.peerSocket.addEventListener('message', processMessaging);
