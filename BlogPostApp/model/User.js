const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: [true, "Email is already Regrister!!!"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Not Valid!!!");
        }
      },
    },
    age: {
      required: true,
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age Must be Positive Number!!!");
        }
      },
    },
    pwd: {
      type: String,
      minlength: [8, "PassWord Must be Minimum 8 Length."],
      validate(value) {
        if (value.includes("password")) {
          throw new Error("Password not contain Password!!!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

//Generate Token For User Creation Time:
UserSchema.methods.TokenGenerate = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Private-key");
  user.tokens = await user.tokens.concat({ token });
  await user.save();
  return token;
};

//Hide Unnessaray Information:
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.pwd;
  delete userObject.createdAt;
  delete userObject.tokens;
  delete userObject.updatedAt;
  return userObject;
};

//Encrypt the Password:
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("pwd")) {
    user.pwd = await bcrypt.hash(user.pwd, 8);
  }
  next();
});

const UserModel = new mongoose.model("User", UserSchema, "User");
module.exports = UserModel;
