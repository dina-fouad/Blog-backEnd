const User = require("../models/user");
const Joi = require("joi");
const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const validateId = require("../middlewares/validateObjectId");
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");
const uploadImgs = require("../middlewares/photoUpload");
const {
  removeImgCloudinary,
  uploudImgCloudinary,
} = require("../utils/coudinary");
const path = require("path");
const fs = require("fs");



const router = express.Router();

// get all users profile
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const allUsers = await User.find().select("-password").populate('posts');
  

    res.send(allUsers);
  } catch (error) {
    return res.send(error);
  }
});

//get a specific user
router.get("/:id", validateId, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select("-password").populate('posts');
  if (!user) {
    return res.status(404).json({ msg: "this user not found" });
  }
  try {
    res.json(user);
  } catch (err) {
    res.send(err);
  }
});

//update users
router.put(
  "/:id",
  validateId,
  verifyToken,

  async (req, res) => {
    const id = req.params.id;
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed , only user himself" });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") delete req.body[key];
    });

    const { error } = validationUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User is not found" });
    }

    try {
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }

      if (req.body.userName) {
        user.userName = req.body.userName;
      }

      if (req.body.bio) {
        user.bio = req.body.bio;
      }

      await user.save();

      res.json({
        user,
      });
    } catch (error) {
      res.send(error);
    }
  }
);

//get - Count all documents in the User collection
router.get("/profile/count", verifyToken, isAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.send(count);
  } catch (error) {
    res.send(error);
  }
});

//upload profile imgs
router.post(
  "/profile/profileImg",
  verifyToken,
  uploadImgs.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No file provided" });
    }

    const user = await User.findById(req.user.id);

    const pathImage = path.join(__dirname, `../images/${req.file.filename}`);

    const result = await uploudImgCloudinary(pathImage);

    // to remove old img from cloudinary
    if (user.profileImage.publicId !== null) {
      await removeImgCloudinary(user.profileImage.publicId);
    }

    try {
      user.profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      await user.save();

      res.json({
        msg: "your image profile uploaded successfuly",
        profileImage: user.profileImage,
      });

      // to remove img from server after uploaded
      fs.unlinkSync(pathImage);
    } catch (err) {
      return res.send(err);
    }
  }
);

//delete profile user
router.delete("/:id", validateId, verifyToken, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User is not found" });
  }
  try {
    await removeImgCloudinary(user.profileImage.publicId);
    await User.findByIdAndDelete(req.params.id);
    return { msg: "User deleted successfully" };
  } catch (err) {
    return res.send(err);
  }
});

//validation update user
function validationUpdateUser(obj) {
  const schema = Joi.object({
    userName: Joi.string().trim().min(2).max(50).optional(),

    password: passwordComplexity(),

    bio: Joi.string(),
  });

  return schema.validate(obj);
}

module.exports = router;
