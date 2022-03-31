const mongoose = require("mongoose");
const PostActivityModel = require("../model/Post-Activity");
const PostSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    post: {
      type: String,
      minlength: [10, "post requried atlest 10 Letters"],
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    like: {
      type: Number,
      default: 0,
    },
    Comment: {
      type: Array,
    },
  },
  { timestamps: true }
);
//Hide Unnessaray Information:
PostSchema.methods.toHidePost = function () {
  const Post = this;
  const PostObject = Post.toObject();
  delete PostObject.createdAt;
  delete PostObject.updatedAt;
  return PostObject;
};
const PostModel = new mongoose.model("Post", PostSchema, "Post");
module.exports = PostModel;
