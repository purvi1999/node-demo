const express = require("express");
const router = express.Router();
const Topic = require("../model/Topic");
const AuthMiddleware = require("../Middleware/Auth");

//Create Topic of Blog:
router.post("/Blog-Topic", AuthMiddleware, async (req, res) => {
  try {
    const topic = await new Topic({ ...req.body, owner: req.user._id });
    console.log(topic);
    await topic.save();
    res.status(201).send({ message: "Topic Created..." });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
