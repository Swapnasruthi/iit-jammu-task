const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config;

const userAuth = async (req, res, next) => {
  try {
    //read the token
    const { token } = req.cookies;

    //verify the token
    if (!token) {
      return res.status(401).send("unAuthorised User!");
    }

    //decode the token to get the id
    const decodeId = await jwt.verify(token, process.env.SECRET_CODE);

    const { _id } = decodeId;

    const user = await User.findById(_id);

    //verify the use

    if (!user) {
      throw new Error("user not found");
    }

    //sending the user to the next function

    req.User = user;

    next();
  } catch (err) {
    res.status(400).send("error found:" + err.message);
  }
};


module.exports = {userAuth}