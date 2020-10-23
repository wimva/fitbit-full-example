import { inbox } from 'file-transfer';
import * as filesystem from 'fs';
import * as messaging from 'messaging';

const state = {
  items: [],
  list: [],
  letter: '',
  companionTimestamp: 0,
  temperature: 0,
};

// set callback so you can interact with this in your views
// could be optimised though, as it calls for every updated value, so not specific
let callback = null;

export function setStateCallback(cb) {
  callback = cb;
}

export function removeStateCallback() {
  callback = null;
}

// save state to local storage on watch so it's always avaialble at start of app
function updateState() {
  filesystem.writeFileSync('state.txt', state, 'json');
}

// load state on start of app
function loadState() {
  try {
    const loadedState = filesystem.readFileSync('state.txt', 'json');
    if (typeof loadedState.items !== 'undefined') state.items = loadedState.items;
    if (typeof loadedState.list !== 'undefined') state.list = loadedState.list;
    if (typeof loadedState.letter !== 'undefined') state.letter = loadedState.letter;
    if (typeof loadedState.companionTimestamp !== 'undefined') state.companionTimestamp = loadedState.companionTimestamp;
    if (typeof loadedState.temperature !== 'undefined') state.temperature = loadedState.temperature;
  } catch (err) {
    console.error(`Failed loading state: ${err}`);
  }
}

// get and set items from within app
export function getStateItem(key) {
  return state[key];
}

export function setStateItem(key, value) {
  state[key] = value;
  updateState();
}

// process file transfer files
function processFiles() {
  let fileName;
  while (fileName = inbox.nextFile()) { // eslint-disable-line
    if (fileName === 'settings.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      if (typeof data.items !== 'undefined') state.items = data.items;
      if (typeof data.list !== 'undefined') state.list = data.list;
      if (typeof data.letter !== 'undefined') state.letter = data.letter;

      updateState();
      if (callback) callback();
    } else if (fileName === 'weather.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      if (typeof data.temperature !== 'undefined') state.temperature = data.temperature;

      updateState();
      if (callback) callback();
    }
  }
}

// process messages
function processMessaging(evt) {
  if (typeof evt.data.companionTimestamp !== 'undefined') state.companionTimestamp = evt.data.companionTimestamp;

  updateState();
  if (callback) callback();
}

// set up
export function init() {
  loadState();
  processFiles();
  inbox.addEventListener('newfile', processFiles);
  messaging.peerSocket.addEventListener('message', processMessaging);
}
