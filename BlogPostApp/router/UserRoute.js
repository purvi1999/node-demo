const express = require("express");
const Users = require("../model/User");
const bcrypt = require("bcryptjs");
const AuthMiddleware = require("../Middleware/Auth");
require("../db/mongoose");
const router = express.Router();
//Regristation:
router.post("/users", async (req, res) => {
  try {
    const new_user = await Users(req.body).save();
    const tokens = await new_user.TokenGenerate();
    res.status(201).send({
      new_user,
      tokens,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Login:
router.post("/users/login", async (req, res) => {
  try {
    const email = req.body.email;
    const pwd = req.body.pwd;
    if (!(email || pwd)) {
      return res.status(400).send({ msg: "Email and Password is Requried..." });
    }
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ msg: "Unable To Login" });
    }
    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(401).send({ msg: "Unable To Login" });
    }
    const tokens = await user.TokenGenerate();
    // console.log(tokens);
    res.status(200).send({
      user: user.toJSON(),
      tokens,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

//Logout:
router.post("/users/logout", AuthMiddleware, async (req, res) => {
  try {
    req.user.tokens = await req.user.tokens.filter((get_token) => {
      return get_token.token !== req.tokens;
    });
    await req.user.save();

    res.send({});
  } catch (e) {
    res.status(500).send();
  }
});

//Logout All Users:
router.post("/users/logout/all", AuthMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
