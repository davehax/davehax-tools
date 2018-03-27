import _ from "lodash";
import Choices from "choices.js";
import { 
    fetchJson, 
    getDuplicateEntriesInStringArray, 
    getDuplicatesReducer, 
    getSelfOrParentByClass, 
    sortAlphabeticallyAsc, 
    sortAlphabeticallyDesc, 
    stripIntersectionFromArrays 
} from "./util.js"
import Picker from "./picker.js";
import PokePicker from "./pokepicker.js";
import type, { effectiveness } from "./type.js";

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

        legend.appendChild(buildLegendItem("Super Effective", "double-effective"));
        legend.appendChild(buildLegendItem("Super Vulnerable", "double-vulnerable"));
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

export default PokeType;