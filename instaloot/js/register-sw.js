const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Service Workers are a progressive technology. We can safely ignore unsupported browsers
if (!isLocalhost && 'serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('/instaloot/sw-instaloot.js').then(function () {
        console.log('CLIENT: service worker registration complete.');
    }, function () {
        console.log('CLIENT: service worker registration failure.');
    });

    navigator.serviceWorker.register('/sw-noop.js').then(function () {
        console.log('CLIENT: **noop** service worker registration complete.');
    }, function () {
        console.log('CLIENT: **noop** service worker registration failure.');
    });
} else {
    console.log('CLIENT: service worker is not supported.');
}