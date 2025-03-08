const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  username: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" }); // Use email as the username field

module.exports = mongoose.model("User", UserSchema);
