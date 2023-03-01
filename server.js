const fs = require("fs");
const path = require("path")
const { animals } = require("./animals.json")
const express = require("express");
const { create } = require("domain");
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming string or array data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if peronalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === "string") {
            personalityTraitsArray = [query.personalityTraits]
        } else {
            personalityTraitsArray = query.personalityTraits
        }
        // loop through each trait in the personalityTraits array: 
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        })
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults
}

function createNewAnimal(body, animalsArray) {
   const animal = body;
  function animalsArray() {
    let animalsArray = animalsArray.push(animal);
  }
    fs.writeFileSync(
        path.join(__dirname, "./data/animals.json"),
        JSON.stringify({ animals: animalsArray }, null, 2)
    )
   return animal;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== "string") {
        return false;
    }
    if (!animal.species || typeof animal.species !== "string") {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== "string") {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true
}

app.get("/api/animals", (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results)
    }
    res.json(results)
});

app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result)
    } else {
        res.send(404)
    }
});

app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    res.json(result);
})

app.post("/api/animals", (req, res) => {
    //req.body is where out incoming content will be
    req.body.id = animals.length.toString();

    // add animal to json file and animals array in this function 
    if (!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted.")
    } else {
        const animal = createNewAnimal(req.body)
        res.json(animal)
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});