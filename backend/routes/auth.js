const express = require("express");

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/auth");
require("dotenv").config();

authRouter.use(cookieParser());
authRouter.use(express.json()); // to read json data from the db

//register
authRouter.post("/register", async (req, res) => {
  try {
    //validating the data
    const { userName, email, password } = req.body;

    //encrypting the password

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      email,
      password: passwordHash,
    });
    await user.save();

    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_CODE, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Render
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });

    res.send(user);
  } catch (err) {
    res.status(400).send( err.message);
  }
});

//login

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User not Found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, process.env.SECRET_CODE, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Render
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get a user

authRouter.get("/getUser", userAuth, (req, res) => {
  try {
    const { token } = req.cookies;
    res.send(req.User);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0)
    });
    res.status(200).send("Logout successful!");
  } catch (err) {
    console.log("Error while logging out", err);
    res.status(500).send("Server error during logout");
  }
});
module.exports = authRouter;
