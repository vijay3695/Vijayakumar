/* jsdom is missing a few browser APIs this app legitimately uses.
   Stub only what is genuinely absent - never to paper over a real bug. */

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia;
}

// jsdom has no layout engine, so scrolling APIs are absent or throw.
Element.prototype.scrollTo = function scrollTo() {};
window.scrollTo = (() => {}) as typeof window.scrollTo;

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}
