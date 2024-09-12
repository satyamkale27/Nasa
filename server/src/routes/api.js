// version 1 //
const express = require("express");

const planetsRouter = require("./planets/planets.routes");
const launchesRouter = require("./launches/launches.router");
const api = express.Router();

api.use("/launches", launchesRouter);
api.use("/planets", planetsRouter);
module.exports = api;
