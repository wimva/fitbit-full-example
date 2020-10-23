import * as messaging from 'messaging';

// get weather
export function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'weather',
    });
  }
}

// set up
export function init() {
  messaging.peerSocket.addEventListener('open', () => {
    fetchWeather();
  });
}
