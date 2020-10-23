import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';

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

  outbox.enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* Short messages */
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
