import PokeType from "./js/poketype.js";
import RegisterServiceWorker from "./js/register-sw.js";
import "choices.js/assets/styles/css/choices.min.css";
import "./css/style.css";

// App initialisation logic
let poketyper = new PokeType(".poketype");
poketyper.go();

// Register our service worker
RegisterServiceWorker();