import document from 'document';
import { getLocationName, getListItem } from '../commands';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';

let $button = null;
let $locationName = null;

function doSomething() {
  console.log('hallo detail');
}

function draw() {
  const item = getStateItem('listItem');
  console.log(JSON.stringify(item));
  if (item) {
    $locationName.text = item.user;
  }
}

export function destroy() {
  console.log('destroy detail page');
  $locationName = null;
  $button = null;
  removeStateCallback('detail');
}

export function init() {
  console.log('init detail page');
  $locationName = document.getElementById('location');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };

  doSomething();
  getLocationName();
  getListItem(getStateItem('detailId'));
  setStateCallback('detail', draw);
  // draw();
}
