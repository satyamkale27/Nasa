const launchesDatabase = require("./launches.mongo");
const launches = new Map();
let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "keepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "kepler-442 b",
  customer: ["SATYAM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);
function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  ); // {} meanse find all document in mongodb //
}
async function saveLaunch(launch) {
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customer: ["Satyam kale, NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}
function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
