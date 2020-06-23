const mongoose = require("mongoose");
const { Schema } = mongoose;

const pawSchema = new Schema({
  title: String,
  ingredients: String,
  description: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
});

module.exports = mongoose.model("Paw", pawSchema);
