const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://nasa-api:iBbJI1fIidT0lrUr@nasacluster.up1ge.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster";

mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.once("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
