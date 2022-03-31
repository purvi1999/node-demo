const mongoose = require("mongoose");
const User = require("../model/User");
const TopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Topic is already Added..."],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
//Hide Topic Detail:
TopicSchema.methods.toHideTopicDetail = function () {
  const topic = this;
  const topicObject = topic.toObject();
  delete topicObject.createdAt;
  delete topicObject.updatedAt;
  return topicObject;
};
const TopicModel = new mongoose.model("Topic", TopicSchema, "Topic");
module.exports = TopicModel;
