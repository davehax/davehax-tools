// In an ideal world this code would work. Unfortunately the PokeAPI site seems to prevent scraping. So... this will be left up as Proof of Concept code.

let fs = require("fs");
let fetch = require("node-fetch");

// Extract from the API response *exactly* what we need, and not unrelated fluff
let pokemonDataExtractor = (pokemon) => {
    return {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        types: pokemon.types,
    }
}

// Async wrapper for fetching json
async function fetchJson(url) {
    try {
        let response = await fetch(url)
        let json = await response.json()
        return json;
    }
    catch (error) {
        throw error;
    }
};


// We're going to scrape the Pokemon API to reduce eventual client load times! How exciting.
async function scrape() {
    let pokemonData = [];
    let total = 0;
    let counter = 0;
    let percentComplete = 0;

    try {

        let allPokemon = await fetchJson("https://pokeapi.co/api/v2/pokemon?limit=9999")
        total = allPokemon.results.length;

        for (let i = 0; i < total; i++) {
            // Output
            counter++;
            percentComplete = (counter/total * 100).toFixed(2);
            process.stdout.write(`\r${percentComplete}%: ${allPokemon.results[i].url}`);

            // Get data
            let pokemon = await fetchJson(allPokemon.results[i].url);
            pokemonData.push(pokemonDataExtractor(pokemon));
        }

        process.stdout.write("\n");
        console.log("Finished.");

        // Write to a json file for use in .js code
        fs.writeFileSync("src/js/pokedata.json", JSON.stringify(pokemonData));

    }
    catch (error) {
        // Probably an error from the Pokemon API
        console.log(error); 
    }
}

scrape();