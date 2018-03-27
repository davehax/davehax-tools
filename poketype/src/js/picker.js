import { getSelfOrParentByClass } from "./util.js";

// Picker
export default class Picker {
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