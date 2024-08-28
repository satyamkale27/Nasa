const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
  keplarName: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Planet", planetSchema);
