import document from 'document';

let $elem = null;

function doSomething() {
  console.log('hallo');
  console.log($elem);
}

export function destroy() {
  console.log('destroy index page');
  $elem = null;
}

export function init() {
  console.log('destroy index page');
  $elem = document.getElementById('elem');

  doSomething();
}
