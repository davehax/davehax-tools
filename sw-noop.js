// A simple, no-op service worker that takes immediate control.
// https://stackoverflow.com/a/38980776

self.addEventListener('install', () => {
    // Skip over the "waiting" lifecycle state, to ensure that our
    // new service worker is activated immediately, even if there's
    // another tab open controlled by our older service worker code.
    self.skipWaiting();
});