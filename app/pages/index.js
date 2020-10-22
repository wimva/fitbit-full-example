import document from 'document';
import { switchPage } from '../navigation';

let $buttonDetail = null;
let $buttonReplace = null;

function doSomething() {
  console.log('hallo index');
}

export function destroy() {
  console.log('destroy index page');
  $buttonDetail = null;
  $buttonReplace = null;
}

export function init() {
  console.log('init index page');
  $buttonDetail = document.getElementById('detail-button');
  $buttonReplace = document.getElementById('replace-button');

  $buttonDetail.onclick = () => {
    switchPage('detail', true);
  };
  $buttonReplace.onclick = () => {
    switchPage('replace');
  };

  doSomething();
}
