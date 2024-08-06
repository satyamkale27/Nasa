const express = require("express");
const planetRouter = express.Router();
planetRouter.get("/planets", getAllPlanets);
module.exports = planetRouter;
