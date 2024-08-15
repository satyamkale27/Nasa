const express = require("express");
const {
  httpGetgetAllLaunches,
  httpAddNewLaunch,
} = require("./launches.controllers");
const launchesRouter = express.Router();
launchesRouter.get("/launches", httpGetgetAllLaunches);
launchesRouter.post("/launches", httpAddNewLaunch);
module.exports = launchesRouter;
