const type = {
    bug: "bug",
    dark: "dark",
    dragon: "dragon",
    electric: "electric",
    fairy: "fairy",
    fighting: "fighting",
    fire: "fire",
    flying: "flying",
    ghost: "ghost",
    grass: "grass",
    ground: "ground",
    ice: "ice",
    normal: "normal",
    poison: "poison",
    psychic: "psychic",
    rock: "rock",
    steel: "steel",
    water: "water"
}

let effectiveness = {
    "bug": {
        "effective": [type.dark, type.grass, type.psychic],
        "resist": [type.fighting, type.grass, type.ground],
        "immune": []
    },

    "dark": {
        "effective": [type.ghost, type.psychic],
        "resist": [type.dark, type.ghost],
        "immune": [type.psychic]
    },

    "dragon": {
        "effective": [type.dragon],
        "resist": [type.electric, type.fire, type.grass, type.water],
        "immune": []
    },

    "electric": {
        "effective": [type.flying, type.water],
        "resist": [type.electric, type.flying, type.steel],
        "immune": []
    },

    "fairy": {
        "effective": [type.dark, type.dragon, type.fighting],
        "resist": [type.bug, type.dark, type.fighting],
        "immune": [type.dragon]
    },

    "fighting": {
        "effective": [type.dark, type.ice, type.normal, type.rock, type.steel],
        "resist": [type.bug, type.dark, type.rock],
        "immune": []
    },

    "fire": {
        "effective": [type.bug, type.grass, type.ice, type.steel],
        "resist": [type.bug, type.fairy, type.fire, type.grass, type.ice, type.steel],
        "immune": []
    },

    "flying": {
        "effective": [type.bug, type.fighting, type.grass],
        "resist": [type.bug, type.fighting, type.grass],
        "immune": [type.ground]
    },

    "ghost": {
        "effective": [type.ghost, type.psychic],
        "resist": [type.bug, type.poison],
        "immune": [type.fighting, type.normal]
    },

    "grass": {
        "effective": [type.ground, type.rock, type.water],
        "resist": [type.electric, type.grass, type.ground, type.water],
        "immune": []
    },

    "ground": {
        "effective": [type.electric, type.fire, type.poison, type.rock, type.steel],
        "resist": [type.poison, type.rock],
        "immune": [type.electric]
    },

    "ice": {
        "effective": [type.dragon, type.flying, type.grass, type.ground],
        "resist": [type.ice],
        "immune": []
    },

    "normal": {
        "effective": [],
        "resist": [],
        "immune": [type.ghost]
    },
    
    "poison": {
        "effective": [type.fairy, type.grass],
        "resist": [type.bug, type.fairy, type.fighting, type.grass, type.poison],
        "immune": []
    },

    "psychic": {
        "effective": [type.fighting, type.poison],
        "resist": [type.fighting, type.psychic],
        "immune": []
    },

    "rock": {
        "effective": [type.bug, type.fire, type.flying, type.ice],
        "resist": [type.fire, type.flying, type.normal, type.poison],
        "immune": []
    },

    "steel": {
        "effective": [type.fairy, type.ice, type.rock],
        "resist": [type.bug, type.dragon, type.fairy, type.flying, type.grass, type.ice, type.normal, type.psychic, type.rock, type.steel],
        "immune": [type.poison]
    },

    "water": {
        "effective": [type.fire, type.ground, type.rock],
        "resist": [type.fire, type.ice, type.steel, type.water],
        "immune": []
    }
}

// extend effectiveness
for (let i in effectiveness) {
    if (effectiveness.hasOwnProperty(i)) {

        // build not effective, not effective immune, and vulnerable properties
        effectiveness[i].notEffective = [];
        effectiveness[i].notEffectiveImmune = [];
        effectiveness[i].vulnerable = [];

        for (let j in effectiveness) {
            if (effectiveness.hasOwnProperty(j) && i !== j) {

                if (effectiveness[j].resist.indexOf(i) !== -1) { effectiveness[i].notEffective.push(j) }
                if (effectiveness[j].immune.indexOf(i) !== -1) { effectiveness[i].notEffectiveImmune.push(j) }
                if (effectiveness[j].effective.indexOf(i) !== -1) { effectiveness[i].vulnerable.push(j) }

            }
        }

    }
}

class PokeType {
    // As we're a class, all class properties must be declared in the constructor
    constructor(selector) {
        this.selectedType1 = "";
        this.selectedType2 = "";

        this.selector = selector;
        this.container = document.querySelector(selector);
        this.current = null;

        this.type1Picker = null;
        this.type2Picker = null;

        this.pokemonPicker = null;
        this.pokemonPickerChoices = null;

        this.legend = null;

        this.panelStrength = null;
        this.panelWeakness = null;

        if (this.container === null) {
            throw `Unable to find element with selector "${selector}"`
        }

    }

    go() {

        // Build our pickers
        let centeredPanel = document.createElement("div");
        centeredPanel.classList.add("flex-centered");
        this.type1Picker = this.buildPicker();
        this.type2Picker = this.buildPicker();
        centeredPanel.appendChild(this.type1Picker);
        centeredPanel.appendChild(this.type2Picker);

        // Pokemon Picker
        let pokemonPickerContainer = document.createElement("div");
        pokemonPickerContainer.classList.add("panel-wrapper");
        pokemonPickerContainer.classList.add("borderless");
        this.pokemonPicker = document.createElement("select");
        pokemonPickerContainer.appendChild(this.pokemonPicker);

        // Legend
        this.legend = this.buildLegend();

        // Effective
        this.panelStrength = document.createElement("div");
        this.panelStrength.classList.add("panel-wrapper");
        this.panelStrength.classList.add("strength");

        // Resist
        this.panelWeakness = document.createElement("div");
        this.panelWeakness.classList.add("panel-wrapper");
        this.panelWeakness.classList.add("weakness");

        // Build the picker panel
        let pickerPanel = this.buildPickerPanel();

        
        this.container.appendChild(centeredPanel);
        this.container.appendChild(pokemonPickerContainer);
        this.container.appendChild(this.legend);
        this.container.appendChild(this.panelStrength);
        this.container.appendChild(this.panelWeakness);
        this.container.appendChild(pickerPanel);

        PokePicker.getPokemon().then((pokemon) => {
            let choices = pokemon.map((p, idx) => {
                return {
                    value: p.url,
                    label: p.name,
                    id: p.idx
                }
            })
            this.pokemonPickerChoices = new Choices(this.pokemonPicker, {
                choices: choices,
                shouldSort: false
            });
        });

        this.picker = new Picker(".picker-modal", (option) => {
            let selectedType = option.getAttribute("data-type");
            this.updatePickerControl(this.current, selectedType);
            this.displayStrengthsAndWeaknesses();
        });

        // bind events
        this.type1Picker.querySelector(".option").addEventListener("click", (evt) => {
            this.current = this.type1Picker;
            this.picker.open();
        })

        this.type1Picker.querySelector(".btn.close").addEventListener("click", (evt) => {
            this.current = null;
            this.resetPickerControl(this.type1Picker);
            this.displayStrengthsAndWeaknesses();
        })

        this.type2Picker.querySelector(".option").addEventListener("click", (evt) => {
            this.current = this.type2Picker;
            this.picker.open();
        })

        this.type2Picker.querySelector(".btn.close").addEventListener("click", (evt) => {
            this.current = null;
            this.resetPickerControl(this.type2Picker);
            this.displayStrengthsAndWeaknesses();
        })

        this.pokemonPicker.addEventListener("change", (evt) => {
            fetchJson(evt.detail.value).then((d) => {
                this.updatePickerControl(this.type1Picker, d.types[0].type.name);
                if (d.types.length > 1) {
                    this.updatePickerControl(this.type2Picker, d.types[1].type.name);
                }
                else {
                    this.resetPickerControl(this.type2Picker);
                }
                this.displayStrengthsAndWeaknesses();
            })
        });
    }

    resetPickerControl(element) {
        element.querySelector(".option").setAttribute("data-type", "unselected");
        element.querySelector(".option .type").className = "type unselected";
        element.querySelector(".option h3").innerText = "Pick a type";
    }

    updatePickerControl(element, selectedType) {
        element.querySelector(".option").setAttribute("data-type", selectedType);
        element.querySelector(".option .type").className = `type ${selectedType}`;
        element.querySelector(".option h3").innerText = selectedType;
    }

    // Returns an array of <div>'s for picking a Pokemon Type
    buildOptions() {
        let options = []

        for (let pokemonType in type) {
            if (type.hasOwnProperty(pokemonType)) {
                options.push(this.buildOption(pokemonType));
            }
        }

        return options;
    }

    // Returns a <div> representing a single Pokemon Type for use as a selectable option
    buildOption(name, titleOverride) {
        let option = this.buildType(name, titleOverride);
        option.classList.add("option");
        return option;
    }

    // Returns a <div> representing a single Pokemon Type
    buildType(name, titleOverride, ...additionalClasses) {
        // Title
        let displayName = titleOverride || name;

        // Type div
        let typeDiv = document.createElement("div");
        typeDiv.classList.add("type-wrapper");
        // If additional classes are passed in, set them on the type div
        additionalClasses.forEach((c) => typeDiv.classList.add(c));
        typeDiv.setAttribute("data-type", name);

        let icon = document.createElement("div");
        icon.className = `type ${name}`;

        let heading = document.createElement("h3");
        heading.innerText = displayName.toUpperCase();

        typeDiv.appendChild(icon);
        typeDiv.appendChild(heading);

        return typeDiv;
    }

    // Builds the picker
    buildPicker() {
        let picker = document.createElement("div");
        picker.classList.add("picker");
        picker.appendChild(this.buildOption("unselected", "Pick a type"));
        picker.appendChild(this.buildCloseButton());
        return picker;
    }

    // Builds the picker panel
    buildPickerPanel() {
        let options = this.buildOptions();

        // Picker modal
        let pickerModal = document.createElement("div");
        pickerModal.classList.add("picker-modal");

        // Picker panel
        let pickerPanel = document.createElement("div");
        pickerPanel.className = "picker-panel";

        // Options to display in the panel
        let pickerPanelOptions = document.createElement("div");
        pickerPanelOptions.className = "picker-panel-options";

        for (let idx in options) {
            pickerPanelOptions.appendChild(options[idx]);
        }

        pickerPanel.appendChild(pickerPanelOptions);

        // Add a close button to our picker panel
        let closeButton = this.buildCloseButton();
        pickerPanel.appendChild(closeButton);

        pickerModal.appendChild(pickerPanel);

        return pickerModal;
    }

    // Builds the close button
    buildCloseButton() {
        let button = document.createElement("button");
        button.innerHTML = "&times;";
        button.className = "btn close";
        return button;
    }

    // build legend
    buildLegend() {
        const buildLegendItem = (name, clss) => {
            let item = document.createElement("div");
            item.classList.add("legend-item");
            item.classList.add(clss);
            item.innerText = name;
            return item;
        }

        let legend = document.createElement("section");
        legend.classList.add("legend");

        legend.appendChild(buildLegendItem("Super Effective / Resistant", "double-effective"));
        legend.appendChild(buildLegendItem("Super Ineffective / Vulnerable", "double-vulnerable"));
        legend.appendChild(buildLegendItem("Immune", "immune"));

        return legend;
    }

    // Builds a display panel
    buildSimpleDisplayPanel(title, single, double, immune) {
        single = single || []
        double = double || []
        immune = immune || []

        let panel = document.createElement("div");
        panel.classList.add("panel");

        let label = document.createElement("h3");
        label.classList.add("label");
        label.innerText = title;
        panel.appendChild(label);

        immune.forEach((t) => { panel.appendChild(this.buildType(t, false, "immune", "small")) });
        double.forEach((t) => { panel.appendChild(this.buildType(t, false, "double", "small")) });
        single.forEach((t) => { panel.appendChild(this.buildType(t, false, "small")) });

        return panel;
    }

    // Build typed display panel
    buildTypedDisplayPanel(title, selectedTypes, strengthsAndWeaknesses, key) {
        // containing panel
        let panel = document.createElement("div");
        panel.classList.add("panel");
        
        // title e.g. effective against
        let label = document.createElement("h3");
        label.classList.add("label");
        label.innerText = title;
        panel.appendChild(label);

        // flex panel
        let flexPanel = document.createElement("div");
        flexPanel.classList.add("panel");
        flexPanel.classList.add("flex");

        // Using the hashmap keys, derive the titles required
        selectedTypes.forEach((selectedType) => {
            let p = document.createElement("div");
            p.classList.add("panel");
            p.classList.add("typed");

            strengthsAndWeaknesses[selectedType][key].forEach((t) => {
                p.appendChild(
                    this.buildType(t, false, "small")
                )
            })

            // add the type label
            let typeLabel = document.createElement("h4");
            typeLabel.classList.add("label");
            typeLabel.innerText = selectedType;
            
            // Append the type label to the panel
            p.appendChild(typeLabel);

            // Append the panel to the flex-panel - the parent panel
            flexPanel.appendChild(p);
        })

        panel.appendChild(flexPanel);

        return panel;
    }

    // get the selected types
    getSelectedTypes() {
        // get the one or two types selected
        let selectedTypes = [];
        selectedTypes.push(this.type1Picker.querySelector(".option").getAttribute("data-type"));
        selectedTypes.push(this.type2Picker.querySelector(".option").getAttribute("data-type"));

        selectedTypes = selectedTypes.filter((t) => {
            return t.toLowerCase() !== "unselected";
        })

        return _.uniq(selectedTypes);
    }

    // Perform POKEMAN calcumalations
    calculateStrengthsAndWeaknesses(selectedTypes) {
        // define our return object to be filled in this function
        let effectivenessProfile = {
            combined: {
                resist: [],
                resistImmune: [],
                vulnerable: [],

                // doubles
                resistDouble: [],
                vulnerableDouble: []
            }
        }

        // Array vars so they can be passed by-reference to functions
        let resist = [];
        let resistImmune = [];
        let vulnerable = [];

        // force distinct values for selected types
        selectedTypes = _.uniq(selectedTypes);

        // Combine resist, vulnerable and immune
        selectedTypes.forEach((t) => {
            let typeInfo = effectiveness[t];
            effectivenessProfile[t] = typeInfo;
            resist = resist.concat(typeInfo.resist);
            vulnerable = vulnerable.concat(typeInfo.vulnerable);
            resistImmune = resistImmune.concat(typeInfo.immune);
        });

        // vulnerable and immune combine to become resist
        let intersect1 = stripIntersectionFromArrays(vulnerable, resistImmune);
        vulnerable = intersect1.arguments[0];
        resistImmune = intersect1.arguments[1];
        resist = resist.concat(intersect1.intersection);

        // resist and vulnerable cancel each other out
        let intersect2 = stripIntersectionFromArrays(resist, vulnerable);
        resist = intersect2.arguments[0];
        vulnerable = intersect2.arguments[1];

        // extract duplicates
        effectivenessProfile.combined.resistDouble = resist.reduce(getDuplicatesReducer, []);
        effectivenessProfile.combined.vulnerableDouble = vulnerable.reduce(getDuplicatesReducer, []);

        // Get only distinct values for resist and vulnerable
        // And then filter out items that appear in the double arrays
        resist = _.uniq(resist).filter((t) => effectivenessProfile.combined.resistDouble.indexOf(t) === -1);
        vulnerable = _.uniq(vulnerable).filter((t) => effectivenessProfile.combined.vulnerableDouble.indexOf(t) === -1);

        effectivenessProfile.combined.resist = resist;
        effectivenessProfile.combined.resistImmune = resistImmune;
        effectivenessProfile.combined.vulnerable = vulnerable;

        // Sort the arrays in the combined object alphabetically ascending
        for (let key in effectivenessProfile.combined) {
            if (effectivenessProfile.combined.hasOwnProperty(key)) {
                effectivenessProfile.combined[key] = effectivenessProfile.combined[key].sort(sortAlphabeticallyAsc);
            }
        }

        return effectivenessProfile;
    }

    //
    displayStrengthsAndWeaknesses() {
        this.resetStrengthsAndWeaknesses();

        let selectedTypes = this.getSelectedTypes();

        // guard against no types selected
        if (selectedTypes.length === 0) {
            return;
        }

        let strengthsAndWeaknesses = this.calculateStrengthsAndWeaknesses(selectedTypes);
        console.log(strengthsAndWeaknesses);

        // effective panel - prioritise double effective
        let eTitle = document.createElement("h2");
        eTitle.innerText = "Strengths";
        this.panelStrength.appendChild(eTitle);


        
        this.panelStrength.appendChild(
            this.buildTypedDisplayPanel(
                "Effective Against",
                selectedTypes,
                strengthsAndWeaknesses,
                "effective"
            )
        );

        this.panelStrength.appendChild(
            this.buildSimpleDisplayPanel(
                "Resistant To",
                strengthsAndWeaknesses.combined.resist,
                strengthsAndWeaknesses.combined.resistDouble,
                strengthsAndWeaknesses.combined.resistImmune
            )
        );

        

        let rTitle = document.createElement("h2");
        rTitle.innerText = "Weaknesses";
        this.panelWeakness.appendChild(rTitle);

        this.panelWeakness.appendChild(
            this.buildSimpleDisplayPanel(
                "Vulnerable To",
                strengthsAndWeaknesses.combined.vulnerable,
                strengthsAndWeaknesses.combined.vulnerableDouble
            )
        )

        this.panelWeakness.appendChild(
            this.buildTypedDisplayPanel(
                "Not Effective Against",
                selectedTypes,
                strengthsAndWeaknesses,
                "notEffective"
            )
        )
    }

    // 
    resetStrengthsAndWeaknesses() {
        this.panelStrength.innerHTML = "";
        this.panelWeakness.innerHTML = "";
    }
}





// Picker
class Picker {
    constructor(selector, onOptionSelected) {
        this.container = document.querySelector(selector);
        this.onOptionSelected = onOptionSelected;

        if (this.container === null) {
            throw `Unable to find element with selector ${selector}`
        }

        this.container.addEventListener("click", (evt) => {

            // dispatch event based on what element was clicked
            if ((evt.target.classList.contains("btn") && evt.target.classList.contains("close")) || evt.target.classList.contains("picker-modal")) {
                this.close();
            }
            else {
                let option = getSelfOrParentByClass(evt.target, "option");
                if (option !== null) {
                    // an option was selected, pass the element to the callback and close
                    this.onOptionSelected(option);
                    this.close();
                }
            }

        });
    }

    open() {
        this.container.classList.add("visible");
    }

    close() {
        this.container.classList.remove("visible");
    }
}

// Pokemon Picker
class PokePicker {
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


// Some utility functions
const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    reject(response);
                }
            })
            .then((data) => {
                resolve(data);
            })
    });
}

// Get self or parent (node) by class name
const getSelfOrParentByClass = (element, className) => {
    if (element.classList.contains(className)) {
        return element;
    }

    while (element !== null && !element.classList.contains(className)) {
        element = element.parentElement;
    }

    return element;
}

// adapted from https://stackoverflow.com/a/35922651
// to use: 
// myArray.reduce(getDuplicatesReducer, [])
const getDuplicatesReducer = (accumulator, element, idx, arr) => {
    // First, check that the .indexOf() function returns an index not equal to the index of the current element
    // Then check that the element is not already in the accumulator array
	if (arr.indexOf(element) !== idx && accumulator.indexOf(element) < 0) {
        accumulator.push(element);
    }
    return accumulator;
}

// In hindsight this function was a bit silly, if not creative
const getDuplicateEntriesInStringArray = (array) => {
    let duplicates = [];
    let duplicateKeys = [];

    // Exploit the fact that JavaScript arrays are hashmaps
    // You will need a different and far more robust approach for object based arrays
    for (let key in array) {
        let val = array[key];
        if (typeof(duplicates[val]) === "undefined") {
            duplicates[val] = 1
        }
        else {
            duplicates[val]++;
        }
    }

    // Now extract each key where the value is greater than 1
    for (let key in duplicates) {
        if (duplicates[key] > 1) {
            duplicateKeys.push(key);
        }
    }

    return duplicateKeys;
}

// Lexical sort funcs
const sortAlphabeticallyAsc = (a, b) => { return a.localeCompare(b); }
const sortAlphabeticallyDesc = (a, b) => { return a.localeCompare(b); }

// Will potentially mutate the arrays passed in
// Returns an object {
//      arguments: [array1, array2, ..., arrayN], -- these arrays are in the order that they were passed in as arguments
//      intersection: [item1, item2, ..., itemN]   
// }
const stripIntersectionFromArrays = (...arrays) => {
    let intersection = [];

    // we need a copy of each array first
    let clones = [];
    arrays.forEach((arr) => {
        clones.push(_.clone(arr));
    });

    // Loop through each array passed in
    for (let i = 0; i < arrays.length; i++) {
        // Loop through each cloned array
        for (let j = 0; j < clones.length; j++) {
            // If we aren't comparing the same array to itself then
            if (i !== j) {
                // For all elements in arrays[i]
                arrays[i] = arrays[i].filter((e) => {
                    // If the element occurs in clones[j]
                    if (clones[j].indexOf(e) !== -1) {
                        // Push the element on to the intersection array
                        intersection.push(e);
                        // And remove the element from arrays[i] by returning false
                        return false;
                    }
                    else {
                        // Keep the element if it doesn't occur in clones[j]
                        return true;
                    }
                })
            }
        }
    }

    return {
        intersection: intersection,
        arguments: arrays
    }
}