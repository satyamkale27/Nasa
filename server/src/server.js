const http = require("http");
require("dotenv").config(); // to use credentails from .env // // always use it on top for other imports can use it //
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.models");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
}
startServer();
