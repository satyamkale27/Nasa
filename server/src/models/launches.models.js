const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const Validateplanets = require("./planets.mongo"); // import to validate the planet before launch //
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, // exists flight_number //
  mission: "keepler Exploration X", // exists name //
  rocket: "Explorer IS1", // exists // rocket.name //
  launchDate: new Date("December 27, 2030"), // exiists date_local //
  target: "Kepler-442 b", // not applcable //
  customer: ["SATYAM", "NASA"], // payloads.customers //
  upcoming: true, // exists upcoming //
  success: true, //  exists success //
};

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  // .sort() moongose functionality here  //
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber"); // for latest launch we need to sort in decending order do (-) //
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
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

async function loadLaunchData() {
  console.log("Downloading launch data ....");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  ); // no upsert becuase we donot want to insert if it does not exists, we want to just update //

  if (aborted.modifiedCount === 1) return true;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
