const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.models");

async function httpGetgetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}
function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id); // string to number converted because to delete launch number required we have string //
  // if launch doesnt exist //
  // if (!existsLaunchWithId(launchId)) {
  //   return res.status(404).json({
  //     error: "Launch not found",
  //   });
  // }
  res.status(200).json(existsLaunchWithId(launchId));

  // if launch does  exists //
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}
module.exports = {
  httpGetgetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
