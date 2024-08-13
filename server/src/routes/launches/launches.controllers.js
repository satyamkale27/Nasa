const { getAllLaunches } = require("../../models/launches.models");
function httpGetgetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

module.exports = {
  httpGetgetAllLaunches,
};
