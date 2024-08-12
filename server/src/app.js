const express = require("express");
const path = require("path");
const planetsRouter = require("./routes/planets/planets.routes");
const launchesRouter = require("./routes/launches/launches.router");

const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(launchesRouter);
app.use(planetsRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
