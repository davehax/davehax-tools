// Can't stop me!
// Open Chrome DevTools on the following page:
// https://rankedboost.com/pokemon-go/pokedex/ -- use this page
// https://pokemondb.net/pokedex/all -- NOPE - this is for the Pokemon games, has pokemon not available in Pokemon GO yet
// then just select all and run!

// console.save from here: https://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file
(function (console) {

    console.save = function (data, filename) {

        if (!data) {
            console.error('Console.save: No data')
            return;
        }

        if (!filename) filename = 'console.json'

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

// // Array to store all pokemon entries
// var pokedata = [];

// document.getElementById("pokedex").querySelectorAll("tbody tr").forEach((row) => {
//     let p = {};
//     // number
//     p.id = Number(row.querySelector("td:nth-child(1)").innerText);

//     // name
//     p.name = row.querySelector("td:nth-child(2) .ent-name").innerText;

//     // type(s)
//     p.types = [];
//     row.querySelectorAll("td:nth-child(3) .type-icon").forEach((type) => {
//         p.types.push(type.innerText.toLowerCase());
//     })

//     pokedata.push(p);
// });



var pokedex = document.getElementById("gg").querySelectorAll("tbody tr")
var pokedata = [];
pokedex.forEach((row) => {
	var p = {};
	var info = row.querySelector("td:nth-child(1)");
	p.name = info.querySelector(".pokemontypeImgs .PokemonName").innerText;
	p.types = [];
	info.querySelectorAll(".pokemontypes").forEach((typeSpan) => {
        var type = typeSpan.className.split(" ")[1].split("-")[0];
        if (type !== "") {
            p.types.push(type)
        }
    })

	pokedata.push(p)
})

console.save(JSON.stringify(pokedata), "pokedata.json");

