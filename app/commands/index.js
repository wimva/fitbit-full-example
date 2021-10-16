import * as messaging from 'messaging';

// get weather
export function getLocationName() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'location',
    });
  }
}

// get list item
export function getListItem(id) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'getListItem',
      id: id,
    });
  }
}

// get list data
export function getListData() {
  console.log('ik kom hier!!!');
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'getListData',
    });
  }
}

// set up
export function init() {
  messaging.peerSocket.addEventListener('open', () => {
    getLocationName();
    getListData();
  });
}
