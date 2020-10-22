import document from 'document';
import { switchPage } from '../navigation';

let $button = null;

function doSomething() {
  console.log('hallo replace');
}

export function destroy() {
  console.log('destroy replace page');
  $button = null;
}

export function init() {
  console.log('init replace page');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    switchPage('index');
  };

  doSomething();
}
