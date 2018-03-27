import PokeType from "./js/poketype.js";
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import "choices.js/assets/styles/css/choices.min.css";
import "./css/style.css";

// App initialisation logic
let poketyper = new PokeType(".poketype");
poketyper.go();

// Register our service worker
OfflinePluginRuntime.install();