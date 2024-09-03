const launchesDatabase = require("./launches.mongo");
const Validateplanets = require("./planets.mongo"); // import to validate the planet before launch //
const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "keepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["SATYAM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);
function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  // .sort() moongose functionality here  //
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber"); // for latest launch we need to sort in decending order do (-) //
  return latestLaunch.flightNumber;
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
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
  // function prevents the launch at planet which do not exists in data base //
  const planet = await Validateplanets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }
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

async function scheduleNewLaunch(launch) {
  const newFlighrNumber = (await getLatestFlightNumber()) + 1; // get latest flight number from database and increse by 1 //
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Satyam kale, NASA"],
    flightNumber: newFlighrNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customer: ["Satyam kale, NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
