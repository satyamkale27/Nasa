const express = require("express");
const { httpGetgetAllLaunches } = require("./launches.controllers");
const launchesRouter = express.Router();
launchesRouter.get("/launches", httpGetgetAllLaunches);
module.exports = launchesRouter;
