import PokeType from "./js/poketype.js";
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import "choices.js/assets/styles/css/choices.min.css";
import "./css/style.css";

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// App initialisation logic
let poketyper = new PokeType(".poketype");
poketyper.go();

// Register our service worker
OfflinePluginRuntime.install();

// Register a global no-op Service Worker
if (!isLocalhost && "serviceWorker" in navigator) {
    navigator.serviceWorker.register('/sw-noop.js').then(function () {
        console.log('CLIENT: **noop** service worker registration complete.');
    }, function () {
        console.log('CLIENT: **noop** service worker registration failure.');
    });
}