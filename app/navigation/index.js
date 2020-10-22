import document from 'document';

let pages = {};

export function init(router) {
  pages = router;
}

export function getPage() {
  const re = /.*\/+(.*)+\..*/;
  return document.location.pathname.replace(re, '$1');
}

export function onUnload() {
  const page = getPage();
  if (pages[page] && pages[page].destroy) pages[page].destroy();
}

export async function switchPage(nextPage, stack) {
  const pagePath = `./resources/pages/${nextPage}.view`;
  if (pagePath !== document.location.pathname) {
    const page = getPage();
    if (stack) {
      await document.location.assign(pagePath);
    } else {
      await document.location.replace(pagePath);
    }

    document.onbeforeunload = onUnload;

    if (!stack && pages[page] && pages[page].destroy) pages[page].destroy();
    if (pages[nextPage] && pages[nextPage].destroy) pages[nextPage].destroy();
    if (pages[nextPage] && pages[nextPage].init) pages[nextPage].init();
  }
}
