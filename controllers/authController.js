// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
// require('dotenv').config()
// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookie exist at login ${JSON.stringify(cookies)}`)
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // const foundUser = usersDB.users.find(person => person.username === user);
  const foundUser = await User.findOne({ username: user });
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      // Encode roles and name with token
      {
        UserInfo: {
          username: foundUser.username, // DONT pass password
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    let newRefreshTokenArray = 
    !cookies?.jwt
      ? foundUser.refreshToken // Retain what in the db
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt) //Remove the exist cookie in browser
    if (cookies?.jwt){
    //  const refreshToken = cookies.jwt
    //  const foundToken = await User.findOne({refreshToken}).exec()
    //  // Detect refresh token reuse
    //  if(! foundToken){
    //   console.log("Attempt RToken reuse at login ")
    //   newRefreshTokenArray = []
    //  }
     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
    }
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
    const sresult =await foundUser.save();
    console.log(sresult)
    // Saving refreshToken with current user
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      //  secure: true,   //ONly in Production not dev
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, roles, success: `User ${user} logged` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
