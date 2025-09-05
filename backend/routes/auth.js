const express = require('express');

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();


authRouter.use(cookieParser());
authRouter.use(express.json()); // to read json data from the db



//register
authRouter.post("/register", async(req, res) => {
    try{
        //validating the data
        const {userName, email, password} = req.body;

        //encrypting the password

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            userName, email, password:passwordHash
        });
        await user.save();

        const token = await jwt.sign({_id: user._id}, process.env.SECRET_CODE, {expiresIn: "1d"});
        res.cookie("token", token);

        res.send(user);
    }
    catch(err){

        res.status(400).send("error saving the user"+err.message);


    }
});


//login 

authRouter.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email:email});

        if(!user){
            throw new Error("User not Found");
            
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            const token = await jwt.sign({_id: user._id}, process.env.SECRET_CODE, {expiresIn: "1d"});
            res.cookie("token", token);
            res.send(user);

        }
        else{
            throw new Error("Invalid Credentials!");
        }
    }
    catch(err){
        res.status(400).send("error logging in the user"+err.message);
    }
})


module.exports = authRouter;