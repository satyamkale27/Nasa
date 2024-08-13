const express = require("express");
const { httpGetAllPlanets } = require("./planets.controllers");
const planetRouter = express.Router();
planetRouter.get("/planets", httpGetAllPlanets);
module.exports = planetRouter;
