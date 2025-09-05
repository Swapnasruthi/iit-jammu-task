const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,

      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },

    userPhoto: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema);
