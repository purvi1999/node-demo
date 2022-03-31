const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/blogApp",
  { useNewUrlParser: true },
  () => {
    console.log("MongoDB Connected...");
  }
);
