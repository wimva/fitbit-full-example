import * as messaging from 'messaging';

// get weather
export function getLocationName() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'location',
    });
  }
}

// set up
export function init() {
  messaging.peerSocket.addEventListener('open', () => {
    getLocationName();
  });
}
