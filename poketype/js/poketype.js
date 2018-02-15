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

const effectiveness = {
    "bug": {
        "effective": ["dark", "grass", "psychic"],
        "resist": ["fighting", "grass", "ground"],
        "immune": []
    },

    "dark": {
        "effective": ["ghost", "psychic"],
        "resist": ["dark", "ghost"],
        "immune": ["psychic"]
    },

    "dragon": {
        "effective": ["dragon"],
        "resist": ["electric", "fire", "grass", "water"],
        "immune": []
    },

    "electric": {
        "effective": ["flying", "water"],
        "resist": ["electric", "flying", "steel"],
        "immune": []
    },

    "fairy": {
        "effective": ["dark", "dragon", "fighting"],
        "resist": ["bug", "dark", "fighting"],
        "immune": ["dragon"]
    },

    "fighting": {
        "effective": ["dark", "ice", "normal", "rock", "steel"],
        "resist": ["bug", "dark", "rock"],
        "immune": []
    },

    "fire": {
        "effective": ["bug", "grass", "ice", "steel"],
        "resist": ["bug", "fairy", "fire", "grass", "ice", "steel"],
        "immune": []
    },

    "flying": {
        "effective": ["bug", "fighting", "grass"],
        "resist": ["bug", "fighting", "grass"],
        "immune": ["ground"]
    },

    "ghost": {
        "effective": ["ghost", "psychic"],
        "resist": ["bug", "poison"],
        "immune": ["fighting", "normal"]
    },

    "grass": {
        "effective": ["ground", "rock", "water"],
        "resist": ["electric", "grass", "ground", "water"],
        "immune": []
    },

    "ground": {
        "effective": ["electric", "fire", "poison", "rock", "steel"],
        "resist": ["poison", "rock"],
        "immune": ["electric"]
    },

    "ice": {
        "effective": ["dragon", "flying", "grass", "ground"],
        "resist": ["ice"],
        "immune": []
    },

    "normal": {
        "effective": [],
        "resist": [],
        "immune": ["ghost"]
    },
    
    "poison": {
        "effective": ["fairy", "grass"],
        "resist": ["bug", "fairy", "fighting", "grass", "poison"],
        "immune": [""]
    },

    "psychic": {
        "effective": ["fighting", "poison"],
        "resist": ["fighting", "psychic"],
        "immune": []
    },

    "rock": {
        "effective": ["bug", "fire", "flying", "ice"],
        "resist": ["fire", "flying", "normal", "poison"],
        "immune": []
    },

    "steel": {
        "effective": ["fairy", "ice", "rock"],
        "resist": ["bug", "dragon", "fairy", "flying", "grass", "ice", "normal", "psychic", "rock", "steel"],
        "immune": ["poison"]
    },

    "water": {
        "effective": ["fire", "ground", "rock"],
        "resist": ["fire", "ice", "steel", "water"],
        "immune": []
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
        
        // All-important reset button
        // let reset = document.createElement("button");
        // reset.innerText = "RESET";
        // reset.className = "btn reset";

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
        this.container.appendChild(this.legend);
        this.container.appendChild(this.panelStrength);
        this.container.appendChild(this.panelWeakness);
        // this.container.appendChild(reset);
        this.container.appendChild(pickerPanel);

        this.picker = new Picker(".picker-modal", (option) => {
            let selectedType = option.getAttribute("data-type");
            this.updatePickerControl(this.current, selectedType);
            this.displayStrenthsAndWeaknesses();
        });

        // bind events
        this.type1Picker.querySelector(".option").addEventListener("click", (evt) => {
            this.current = this.type1Picker;
            this.picker.open();
        })

        this.type1Picker.querySelector(".btn.close").addEventListener("click", (evt) => {
            this.current = null;
            this.resetPickerControl(this.type1Picker);
            this.displayStrenthsAndWeaknesses();
        })

        this.type2Picker.querySelector(".option").addEventListener("click", (evt) => {
            this.current = this.type2Picker;
            this.picker.open();
        })

        this.type2Picker.querySelector(".btn.close").addEventListener("click", (evt) => {
            this.current = null;
            this.resetPickerControl(this.type2Picker);
            this.displayStrenthsAndWeaknesses();
        })

        // reset.addEventListener("click", (evt) => {
        //     this.current = null;
        //     this.resetPickerControl(this.type1Picker);
        //     this.resetPickerControl(this.type2Picker);
        //     this.displayStrenthsAndWeaknesses();
        // })
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
    buildType(name, titleOverride) {
        let displayName = titleOverride || name;
        let typeDiv = document.createElement("div");
        typeDiv.classList.add("type-wrapper");
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
    buildDisplayPanel(title, single, double, immune) {
        single = single || []
        double = double || []
        immune = immune || []

        let panel = document.createElement("div");
        panel.classList.add("panel");

        let label = document.createElement("h3");
        label.classList.add("label");
        label.innerText = title;
        panel.appendChild(label);

        immune.forEach((t) => {
            let o = this.buildType(t);
            o.classList.add("immune");
            o.classList.add("small");
            panel.appendChild(o);
        })

        double.forEach((t) => { 
            let o = this.buildType(t);
            o.classList.add("double");
            o.classList.add("small");
            panel.appendChild(o);
        }) 

        single.forEach((t) => { 
            let o = this.buildType(t);
            o.classList.add("small");
            panel.appendChild(o); 
        })         

        this.panelStrength.appendChild(panel);

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
    /*
        - Effective
        - Double Effective
        - Resist
        - Double Resist
        - Immune

        - Not Effective
        - Double Not Effective
        - Vulnerable
        - Double Vulnerable
    */
    calculateStrengthsAndWeaknesses(selectedTypes) {
        let effectiveAgainst = [];
        let doubleEffectiveAgainst = [];
        let notEffectiveAgainst = [];
        let doubleNotEffectiveAgainst = [];
        let vulnerableTo = [];
        let doubleVulnerableTo = [];
        let resists = [];
        let doubleResists = [];
        let immuneFrom = [];
        let immuneAgainst = [];

        for (let key in selectedTypes) {
            let t = effectiveness[selectedTypes[key]];
            effectiveAgainst = effectiveAgainst.concat(t.effective);
            resists = resists.concat(t.resist);
            immuneFrom = immuneFrom.concat(t.immune);
        }

        // double effective indicated by duplicate entries in effectiveAgainst array
        doubleEffectiveAgainst = getDuplicateEntriesInStringArray(effectiveAgainst);

        // double resist indicated by duplicate entries in resists array
        doubleResists = getDuplicateEntriesInStringArray(resists);

        // weak to requires type reverse lookup (1.4x or greater damage from)
        // not effective against requires type reverse lookup
        for (let selectedTypeKey in selectedTypes) {
            let thisType = selectedTypes[selectedTypeKey];

            for (let typeKey in effectiveness) {
                let checkType = effectiveness[typeKey];
                
                if (checkType.effective.indexOf(thisType) > -1) {
                    vulnerableTo.push(typeKey);
                }

                if (checkType.resist.indexOf(thisType) > -1) {
                    notEffectiveAgainst.push(typeKey);
                }

                if (checkType.immune.indexOf(thisType) > -1) {
                    immuneAgainst.push(typeKey);
                }
            }

        }

        doubleVulnerableTo = getDuplicateEntriesInStringArray(vulnerableTo);
        doubleNotEffectiveAgainst = getDuplicateEntriesInStringArray(notEffectiveAgainst);

        // Alright, we have our arrays to work with.
        // For display purposes we only need unique entries in each array
        let uniqEffectiveAgainst = _.uniq(effectiveAgainst);
        let uniqNotEffectiveAgainst = _.uniq(notEffectiveAgainst);
        let uniqVulnerableTo = _.uniq(vulnerableTo);
        let uniqResists = _.uniq(resists);
        let uniqImmuneFrom = _.uniq(immuneFrom);
        let uniqImmuneAgainst = _.uniq(immuneAgainst);

        // more...
        let uniqDoubleEffectiveAgainst = _.uniq(doubleEffectiveAgainst);
        let uniqDoubleNotEffectiveAgainst = _.uniq(doubleNotEffectiveAgainst);
        let uniqDoubleVulnerableTo = _.uniq(doubleVulnerableTo);
        let uniqDoubleResists = _.uniq(doubleResists);

        // return object - can be condensed for clarity
        let obj = {
            effectiveAgainst: uniqEffectiveAgainst.filter((t) => uniqDoubleEffectiveAgainst.indexOf(t) === -1),
            notEffectiveAgainst: uniqNotEffectiveAgainst.filter((t) => uniqDoubleNotEffectiveAgainst.indexOf(t) === -1).filter((t) => uniqImmuneAgainst.indexOf(t) === -1),
            vulnerableTo: uniqVulnerableTo.filter((t) => uniqDoubleVulnerableTo.indexOf(t) === -1),
            resists: uniqResists.filter((t) => uniqDoubleResists.indexOf(t) === -1).filter((t) => uniqImmuneFrom.indexOf(t) === -1),
            immuneFrom: uniqImmuneFrom,
            immuneAgainst: uniqImmuneAgainst,

            doubleEffectiveAgainst: uniqDoubleEffectiveAgainst,
            doubleNotEffectiveAgainst: uniqDoubleNotEffectiveAgainst,
            doubleVulnerableTo: uniqDoubleVulnerableTo,
            doubleResists: uniqDoubleResists
        }

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = obj[key].sort(sortAlphabeticallyAsc);
            }
        }

        return obj;
    }

    //
    displayStrenthsAndWeaknesses() {
        this.resetStrenghtsAndWeaknesses();

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
            this.buildDisplayPanel(
                "Effective Against", 
                strengthsAndWeaknesses.effectiveAgainst, 
                strengthsAndWeaknesses.doubleEffectiveAgainst
            )
        );

        this.panelStrength.appendChild(
            this.buildDisplayPanel(
                "Resistant To",
                strengthsAndWeaknesses.resists,
                strengthsAndWeaknesses.doubleResists,
                strengthsAndWeaknesses.immuneFrom
            )
        )

        

        let rTitle = document.createElement("h2");
        rTitle.innerText = "Weaknesses";
        this.panelWeakness.appendChild(rTitle);

        this.panelWeakness.appendChild(
            this.buildDisplayPanel(
                "Not Effective Against", 
                strengthsAndWeaknesses.notEffectiveAgainst, 
                strengthsAndWeaknesses.doubleNotEffectiveAgainst,
                strengthsAndWeaknesses.immuneAgainst
            )
        );

        this.panelWeakness.appendChild(
            this.buildDisplayPanel(
                "Vulnerable To",
                strengthsAndWeaknesses.vulnerableTo,
                strengthsAndWeaknesses.doubleVulnerableTo
            )
        )

    }

    // 
    resetStrenghtsAndWeaknesses() {
        this.panelStrength.innerHTML = "";
        this.panelWeakness.innerHTML = "";
    }
}






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


// Some utility functions
const getSelfOrParentByClass = (element, className) => {
    if (element.classList.contains(className)) {
        return element;
    }

    while (element !== null && !element.classList.contains(className)) {
        element = element.parentElement;
    }

    return element;
}

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

const sortAlphabeticallyAsc = (a, b) => { return a.localeCompare(b); }
const sortAlphabeticallyDesc = (a, b) => { return a.localeCompare(b); }