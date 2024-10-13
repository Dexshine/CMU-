const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    picture: { type: String },
    studentId: { type: String },
    interests: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
