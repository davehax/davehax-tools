// Pokemon Types as an enum for code autocomplete and hopefully to remove chance of spelling types wrong
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

// this is the effectiveness profile. We start by specifying half of it and then inferring the rest through code
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
            if (effectiveness.hasOwnProperty(j)) {

                if (effectiveness[j].resist.indexOf(i) !== -1) { effectiveness[i].notEffective.push(j) }
                if (effectiveness[j].immune.indexOf(i) !== -1) { effectiveness[i].notEffectiveImmune.push(j) }
                if (effectiveness[j].effective.indexOf(i) !== -1) { effectiveness[i].vulnerable.push(j) }

            }
        }

    }
}

export default type;
export {
    effectiveness
};