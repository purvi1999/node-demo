const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogApp", () => {
  console.log("MongoDB Connected...");
});
