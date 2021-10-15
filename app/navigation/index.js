import document from 'document';

let pages = {};
let previousPage = 'index';

// De navigatie initialiseren met de router (zie router.js)
export function init(router) {
  pages = router;
}

// De naam van de huidige pagina ophalen.
export function getPage() {
  const re = /.*\/+(.*)+\..*/;
  return document.location.pathname.replace(re, '$1');
}

// Button presses opvangen
function onKeyPress(e) {
  switch (e.key) {
    default:
      console.log('unknown key pressed');
      break;
    case 'back':
      e.preventDefault();
      switchPage(previousPage);
      break;
  }
}

// Naar een nieuwe pagina navigeren
export function switchPage(nextPage) {
  const pagePath = `./resources/pages/${nextPage}.gui`;

  // Controleren of de geselecteerde pagina niet huidige pagina is.
  if (pagePath !== document.location.pathname) {
    const page = getPage();
    document.replaceSync(pagePath);
    if (nextPage !== 'index') {
      previousPage = page;
      document.onkeypress = onKeyPress;
    }

    // De vorige pagina vernietigen
    if (pages[page] && pages[page].destroy) pages[page].destroy();

    // Een nieuwe pagina starten
    if (pages[nextPage] && pages[nextPage].init) pages[nextPage].init();
  }
}
