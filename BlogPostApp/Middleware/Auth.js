const jwt = require("jsonwebtoken");
const Users = require("../model/User");
const Auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    const decode_token = await jwt.decode(token, "Private-key");
    const UserFound = await Users.findOne({
      _id: decode_token._id,
      "tokens.token": token,
    });
    console.log(UserFound);
    if (!UserFound) {
      throw new Error("Please Authenticate...");
    }
    req.user = UserFound;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send("please Authenticate....");
  }
};
module.exports = Auth;
