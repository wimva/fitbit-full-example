import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';
import { Image } from 'image';
import { API_KEY } from './keys';

/* Settings */
function sendSettings() {
  const settings = {
    items: settingsStorage.getItem('items')
      ? JSON.parse(settingsStorage.getItem('items')).map((item) => ({
          name: item.name ? JSON.parse(item.name).name : '',
          letter: item.letter ? JSON.parse(item.letter).value : '',
          color: item.color ? JSON.parse(item.color) : '',
        }))
      : [],
    list: settingsStorage.getItem('list')
      ? JSON.parse(settingsStorage.getItem('list')).map((item) => item.value)
      : [],
    letter: settingsStorage.getItem('letter')
      ? JSON.parse(settingsStorage.getItem('letter')).values[0].value
      : '',
  };

  outbox
    .enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* Sending short messages */
function sendShortMessage() {
  const data = {
    companionTimestamp: new Date().getTime(),
  };

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

messaging.peerSocket.addEventListener('open', () => {
  setInterval(sendShortMessage, 10000);
});

messaging.peerSocket.addEventListener('error', (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

/* API Fetch */
async function fetchLocationName(coords) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  let location = '';
  json.features.forEach((feature) => {
    if (
      !location &&
      (feature.place_type[0] === 'locality' ||
        feature.place_type[0] === 'place')
    ) {
      location = feature.text;
    }
  });

  outbox
    .enqueue('location.cbor', cbor.encode({ location }))
    .then(() => console.log(location + ' as location sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

/* Get Map */
async function getMap(coords) {
  const url = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-l+3a88fe(4.415464,51.229788),pin-s+94e3fe(${coords.longitude},${coords.latitude})/auto/336x336?padding=30%2C30%2C30%2C30&access_token=${API_KEY}`;

  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Image.from(buffer, 'image/png'))
    .then((image) =>
      image.export('image/jpeg', {
        background: '#000000',
        quality: 40,
      }),
    )
    .then((buffer) => outbox.enqueue(`map-${Date.now()}.jpg`, buffer))
    .then((fileTransfer) => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}

/* Location functions */
function locationSuccess(location) {
  fetchLocationName(location.coords);
  getMap(location.coords);
}

function locationError(error) {
  console.log(`Error: ${error.code}`, `Message: ${error.message}`);
  // Handle location error (send message to device to show error)
}

/* Handle messages coming from device */
function processMessaging(evt) {
  console.log(evt.data);
  switch (evt.data.command) {
    case 'location':
      geolocation.getCurrentPosition(locationSuccess, locationError);
      break;
    default:
      //
      break;
  }
}

messaging.peerSocket.addEventListener('message', processMessaging);
