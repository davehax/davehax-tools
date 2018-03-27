import _ from "lodash";

// Some utility functions
export const fetchJson = (url) => {
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
export const getSelfOrParentByClass = (element, className) => {
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
export const getDuplicatesReducer = (accumulator, element, idx, arr) => {
    // First, check that the .indexOf() function returns an index not equal to the index of the current element
    // Then check that the element is not already in the accumulator array
	if (arr.indexOf(element) !== idx && accumulator.indexOf(element) < 0) {
        accumulator.push(element);
    }
    return accumulator;
}

// In hindsight this function was a bit silly, if not creative
export const getDuplicateEntriesInStringArray = (array) => {
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
export const sortAlphabeticallyAsc = (a, b) => { return a.localeCompare(b); }
export const sortAlphabeticallyDesc = (a, b) => { return a.localeCompare(b); }

// Will potentially mutate the arrays passed in
// Returns an object {
//      arguments: [array1, array2, ..., arrayN], -- these arrays are in the order that they were passed in as arguments
//      intersection: [item1, item2, ..., itemN]   
// }
export const stripIntersectionFromArrays = (...arrays) => {
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