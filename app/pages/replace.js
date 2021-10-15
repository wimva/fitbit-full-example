import document from 'document';
import { switchPage } from '../navigation';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';

let $button = null;
let $letter = null;
let $timestamp = null;

function doSomething() {
  console.log('hallo replace');
}

function draw() {
  const letter = getStateItem('letter');
  const timestamp = getStateItem('companionTimestamp');

  $timestamp.text = timestamp;

  if (letter) {
    $letter.text = letter;
  } else {
    $letter.text = 'set letter';
  }
}

export function destroy() {
  console.log('destroy replace page');
  $button = null;
  $letter = null;
  $timestamp = null;
  removeStateCallback('replace');
}

export function init() {
  console.log('init replace page');
  $letter = document.getElementById('letter');
  $timestamp = document.getElementById('timestamp');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    switchPage('index');
  };

  setStateCallback('replace', draw);
  doSomething();
  draw();
}
