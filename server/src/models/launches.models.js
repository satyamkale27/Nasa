const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const Validateplanets = require("./planets.mongo"); // import to validate the planet before launch //
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter); // find launches in database //
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
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

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    ) // {} meanse find all document in mongodb //
    .sort({ flightNumber: 1 }) // to get the documents in sequence assending order //
    .skip(skip) // skips the no of frist documents passed in function //
    .limit(limit); // limits the no of document passed in  the function //
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

async function scheduleNewLaunch(launch) {
  //  prevents the launch at planet which do not exists in data base //
  const planet = await Validateplanets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  const newFlighrNumber = (await getLatestFlightNumber()) + 1; // get latest flight number from database and increse by 1 //
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Satyam kale, NASA"],
    flightNumber: newFlighrNumber,
  });

  await saveLaunch(newLaunch);
}

async function populateLaunches() {
  console.log("Downloading launch data ....");
  const response = await axios.post(SPACEX_API_URL, {
    // by post  request we specify more parameters to get specfic data, which is not possible in only get request. so post method sometimes can b used to get data by specifiying queries//
    query: {},
    options: {
      pagination: false,
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
  if (response.status !== 200) {
    console.log("Problem downloading launchdata");
    throw new Error("Launch data download failed");
  }
  const launchDocs = response.data.docs; // responce comes in form or array docs check postman por more //

  for (const launchdoc of launchDocs) {
    // loops the launchDocs array which we got from response //

    const payloads = launchdoc["payloads"]; // to get the payloads from data //
    const customers = payloads.flatMap((payload) => {
      return payload["customers"]; // nested customers in payload will convert into list in single array by the method //
    });
    const launch = {
      flightNumber: launchdoc["flight_number"],
      mission: launchdoc["name"],
      rocket: launchdoc["rocket"]["name"],
      launchDate: launchdoc["date_local"],
      upcoming: launchdoc["upcoming"],
      success: launchdoc["success"],
      customer: customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const fristLaunch = await findLaunch({
    // to find the launch in database with these criteria // to avoid refetching SPACEX_API api //
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (fristLaunch) {
    console.log("Launch data was already loaded");
  } else {
    await populateLaunches();
  }
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
