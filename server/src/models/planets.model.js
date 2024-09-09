const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const { error } = require("console");
const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })

      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanets(planet) {
  try {
    await planets.updateOne(
      //  The updateOne method takes three arguments:
      // The first argument is a filter object that specifies the criteria for selecting the document to update. In this case, it uses the keplerName field from the planet object to find the matching document.
      // The second argument is an update object that specifies the changes to be made to the selected document. In this case, it sets the keplerName field to the value from the planet object.
      // The third argument is an options object that specifies additional options for the update operation. In this case, it uses the upsert option set to true, which means that if no matching document is found, a new document will be created.
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetData,
  getAllPlanets,
};
