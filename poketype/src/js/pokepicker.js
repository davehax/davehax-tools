// Pokemon Picker
export default class PokePicker {
    static buildUrl(endPoint) {
        return `https://pokeapi.co/api/v2${endPoint}`
    }

    // Returns a Promise
    static get(endPoint) {
        return fetchJson(this.buildUrl(endPoint));
    }

    static getPokemon() {
        return new Promise((resolve, reject) => {
            // Cache first strategy
            let pokemon = localStorage.getItem("pokemans");

            // If the cache is empty then request from network
            if (pokemon === null) {
                this.get("/pokemon?limit=9999")
                    .then((results) => {
                        // store in cache
                        localStorage.setItem("pokemans", JSON.stringify(results.results));
                        resolve(results.results);
                    })
                    .catch((error) => reject(error));
            }
            else {
                resolve(JSON.parse(pokemon));
            }
        });
    }

    static getPokemonById(id) {
        return this.get("/pokemon/id");
    }
}