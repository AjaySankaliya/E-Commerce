const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("session", sessionSchema);
module.exports = Session;
