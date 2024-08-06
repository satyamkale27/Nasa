const express = require("express");
const { getAllPlanets } = require("./planets.controllers");
const planetRouter = express.Router();
planetRouter.get("/planets", getAllPlanets);
module.exports = planetRouter;
