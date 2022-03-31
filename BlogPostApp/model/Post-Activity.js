const mongoose = require("mongoose");
const Post = require("../model/Post");
const User = require("../model/User");
const PostActivitySchema = new mongoose.Schema(
  {
    Post: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    User: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    like: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const PostActivityModel = new mongoose.model(
  "Post_Activity",
  PostActivitySchema,
  "Post_Activity"
);
module.exports = PostActivityModel;
