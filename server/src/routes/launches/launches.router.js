const express = require("express");
const {
  httpGetgetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controllers");
const launchesRouter = express.Router();
launchesRouter.get("/", httpGetgetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);
module.exports = launchesRouter;
