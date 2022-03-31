require("./db/mongoose");
const express = require("express");
const UserRouter = require("./router/UserRoute");
const Blog_TopicRouter = require("./router/TopicRouter");
const Blog_PostRouter = require("./router/PostRouter");
const app = express();
const port = process.env.port || 4000;
app.use(express.json());
app.use(UserRouter);
app.use(Blog_TopicRouter);
app.use(Blog_PostRouter);
app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
