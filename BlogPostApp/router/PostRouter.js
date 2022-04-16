const express = require("express");
const router = express.Router();
const Post = require("../model/Post");
const Topic = require("../model/Topic");
const AuthMiddleware = require("../Middleware/Auth");
const PostActivity = require("../model/Post-Activity");

//Create Post:
router.post("/api/Blog-Post", AuthMiddleware, async (req, res) => {
  try {
    const SearchTopic = await Topic.findOne({ title: req.body.topic });
    // console.log(SearchTopic);
    if (SearchTopic == null) {
      return res.status(400).send({ msg: "Topic is Not Found" });
    }
    const new_post = await Post({
      post: req.body.post,
      Owner: req.user._id,
      topic: SearchTopic._id,
    }).save();
    res
      .status(201)
      .send({ msg: "Post Created...", new_post: new_post.toHidePost() });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Edit Post:
router.put("/api/Blog-Post/:id", AuthMiddleware, async (req, res) => {
  try {
    const UpdatePost = await Post.findOneAndUpdate(
      {
        Owner: req.user._id,
        _id: req.params.id,
      },
      { ...req.body },
      {
        new: true,
      }
    );
    if (UpdatePost == null) {
      return res.status(404).send({ msg: "Not Found Post!!!" });
    }
    res.send(UpdatePost);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Delete Post:
router.delete("/api/Blog-Post/:id", AuthMiddleware, async (req, res) => {
  try {
    const deletePost = await Post.findOneAndDelete({
      Owner: req.user._id,
      _id: req.params.id,
    });
    if (deletePost == null) {
      return res.status(404).send({ msg: "Not Found Post!!!" });
    }
    const deletePostActivity = await PostActivity.findOneAndDelete({
      Post: deletePost._id,
    });
    console.log(deletePostActivity);

    res
      .status(200)
      .send({ msg: "Delete Post...", deletePost: deletePost.toHidePost() });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Get All Post:
router.get("/api/Blog-Post", AuthMiddleware, async (req, res) => {
  try {
    const ShowPost = await Post.find({ Owner: req.user._id });
    if (ShowPost == null) {
      return res.status(404).send("No Post Found...");
    }
    res.send(ShowPost);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

//Get Post By Topic:
router.get("/api/Blog-Post/topic/:topic", AuthMiddleware, async (req, res) => {
  try {
    const topic_id = await Topic.findOne({
      title: req.params.topic,
      owner: req.user._id,
    });
    if (topic_id === null) {
      return res.status(404).send("Invalid Topic");
    }
    const ShowPost = await Post.find({ Owner: req.user._id, topic: topic_id });
    if (ShowPost.length === 0) {
      return res.status(404).send("No Post Found...");
    }
    res.send(ShowPost);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

//Get Most Recent Post - User Post:
router.get(
  "/api/Blog-Post/post/recent-post",
  AuthMiddleware,
  async (req, res) => {
    try {
      const ShowPost = await Post.find({ Owner: req.user._id })
        .sort({ createdAt: -1 })
        .limit(1);
      // console.log(ShowPost.length);
      if (ShowPost.length === 0) {
        return res.status(404).send("No Post Found...");
      }
      res.send(ShowPost);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//Get Most Recent Post in All Post
router.get(
  "/api/Blog-Post/posts/recent-post",
  AuthMiddleware,
  async (req, res) => {
    try {
      const ShowPost = await Post.find({}).sort({ createdAt: -1 }).limit(1);
      // console.log(ShowPost.length);
      if (ShowPost.length === 0) {
        return res.status(404).send("No Post Found...");
      }
      res.send(ShowPost);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//Get Most Like Post:
router.get("/api/Blog-Post/mostLike", AuthMiddleware, async (req, res) => {
  try {
    const MostLikePost = await Post.find({}).sort({ like: -1 }).limit(1);
    // console.log(MostLikePost);
    res.send(MostLikePost);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Like Post:
router.post(
  "/api/Blog-Post/Like/:post_id",
  AuthMiddleware,
  async (req, res) => {
    try {
      const checkLike = await PostActivity.findOne({
        User: req.user._id,
        Post: req.params.post_id,
      });
      console.log(checkLike);
      //If First CheckLike is empty means - first Time Like on post

      if (checkLike === null) {
        //insert postlike in Post_activity model
        const Like_post = await PostActivity({
          Post: req.params.post_id,
          User: req.user._id,
          like: true,
        }).save();
      } else if (checkLike !== null && checkLike.like === false) {
        //If CheckLike is not empty means - User change dislike to like
        //Update postlike in Post_activity model
        await PostActivity.findOneAndUpdate(
          { Post: req.params.post_id, User: req.user._id },
          { like: true }
        );
      }
      if (checkLike !== null && checkLike.like === true) {
        //nothing do because they like alredy...
        return res.status(200).send("You alredy Like Product...");
      } else {
        //For Both Time We want the like count incrase
        const getPost = await Post.findById(req.params.post_id);
        console.log(getPost);
        getPost.like = getPost.like + 1;
        await getPost.save();
      }
      res.status(200).send("Done Like");
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

//dislike Post:
router.post(
  "/api/Blog-Post/Dislike/:post_id",
  AuthMiddleware,
  async (req, res) => {
    try {
      const CheckPost = await PostActivity.findOne({
        User: req.user._id,
        Post: req.params.post_id,
      });
      console.log(CheckPost);
      if (CheckPost !== null && CheckPost.like === false) {
        return res.status(400).send("Nothing happend");
      } else {
        const update_Like_post = await PostActivity.findOneAndUpdate(
          { Post: req.params.post_id, User: req.user._id },
          { like: false }
        );
        const getPost = await Post.findById(req.params.post_id);
        console.log(getPost);
        if (getPost.like !== 0) {
          getPost.like = getPost.like - 1;
          await getPost.save();
          return res.send("Ooops You Don't Like!!!");
        }
        res.status(400).send("Nothing happend");
      }
    } catch (e) {
      res.send(e.message);
    }
  }
);

//Comments on Post
router.post(
  "/api/Blog-Post/Comment/:post_id",
  AuthMiddleware,
  async (req, res) => {
    const CheckPost = await Post.findOne({
      User: req.user._id,
      Post: req.params.post_id,
    });
    if (!req.body.comment) {
      return res.status(400).send("Please Enter Comment");
    }
    const NewComment = {
      User: req.user._id,
      Comment: req.body.comment,
    };
    const Add = await CheckPost.Comment.push(NewComment);
    //console.log(Add);
    CheckPost.save();
    res.send(NewComment);
  }
);
module.exports = router;
