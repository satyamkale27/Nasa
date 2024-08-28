const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://nasa-api:iBbJI1fIidT0lrUr@nasacluster.up1ge.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster";

const { loadPlanetData } = require("./models/planets.model");
const server = http.createServer(app);

mongoose.connection.once("error", (err) => {
  console.error(err);
});

mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetData();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
}
startServer();
