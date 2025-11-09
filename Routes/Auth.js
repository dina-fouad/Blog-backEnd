const Joi = require("joi");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

// Register a new user
router.post("/register", async (req, res) => {
  const { error } = validationRegisterUser(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "User is already exists" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = await new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      bio: req.body.bio,
    });
    await newUser.save();
    const { password, ...userData } = newUser._doc;
    res.status(201).json({ userData });
  } catch (err) {
    return res.send(err);
  }
});

//Login user
router.post("/login", async (req, res) => {
  const { error } = validationLoginUser(req.body);
  if (error) {
    return res.json({ msg: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ msg: "Invalid password or email" });
  }

  const isCorrectPssword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isCorrectPssword) {
    return res.status(404).json({ msg: "Invalid password or email" });
  }
  try {
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY
    );
    res.json({
      id: user._id,
      userName: user.userName,
      // profileImage: user.profileImage,
      token,
    });
  } catch (error) {
    res.send(error);
  }
});

//validation register user
function validationRegisterUser(obj) {
  const JoiSchema = Joi.object({
    userName: Joi.string().trim().min(2).max(50).required(),

    email: Joi.string().trim().email().min(5).max(50).required(),

    password: passwordComplexity().required(),

    // profileImage: Joi.any().description("Profile image file"),

    bio: Joi.string().min(2).max(1000).optional(),
  });

  return JoiSchema.validate(obj);
}

//validation login user
function validationLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().email().min(5).max(50).required(),

    password: passwordComplexity().required(),
  });

  return schema.validate(obj);
}

module.exports = router;
