import document from 'document';
import { getWeather } from '../communication';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';

let $button = null;
let $temperature = null;

function doSomething() {
  console.log('hallo detail');
}

function draw() {
  $temperature.text = getStateItem('temperature');
}

export function destroy() {
  console.log('destroy detail page');
  $temperature = null;
  $button = null;
  removeStateCallback('detail');
}

export function init() {
  console.log('init detail page');
  $temperature = document.getElementById('temperature');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };

  doSomething();
  getWeather();
  setStateCallback('detail', draw);
}
