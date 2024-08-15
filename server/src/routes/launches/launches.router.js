const express = require("express");
const {
  httpGetgetAllLaunches,
  httpAddNewLaunch,
} = require("./launches.controllers");
const launchesRouter = express.Router();
launchesRouter.get("/", httpGetgetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
module.exports = launchesRouter;
