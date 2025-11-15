const Post = require("../models/post");
const express = require("express");
const User = require("../models/user");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const uploadImgs = require("../middlewares/photoUpload");
const {
  removeImgCloudinary,
  uploudPostImgCloudinary,
} = require("../utils/coudinary");
const path = require("path");
const fs = require("fs");
const Joi = require("joi");
const validateId = require("../middlewares/validateObjectId");
const router = express.Router();

//create post
router.post(
  "/",
  verifyToken,
  uploadImgs.single("postImg"),
  async (req, res) => {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    });
    const { error } = validationCreatePost(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const user = await User.findById(req.user.id);

    try {
      const post = await new Post({
        user: user._id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      });

      if (req.file) {
        const pathImage = path.join(
          __dirname,
          `../images/${req.file.filename}`
        );

        const result = await uploudPostImgCloudinary(pathImage);
        post.postImg = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        fs.unlinkSync(pathImage);
      }
      await post.save();

      res.send(post);
    } catch (err) {
      res.send(err);
    }
  }
);

//get all posts
router.get("/", async (req, res) => {
  const { pageSize, pageNumber, category } = req.query;

  const skipValue = (pageNumber - 1) * pageSize;
  let post;
  try {
    if (pageNumber) {
      post = await Post.find()
        .populate("user", ["-password"])
        .populate("likes", "-password")
        .sort({ createdAt: -1 })
        .skip(skipValue)
        .limit(pageSize);
    } else if (category) {
      post = await Post.find({ category })
        .populate("user", ["-password"])
        .populate("likes", "-password");
    } else {
      post = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", ["-password"])
        .populate("likes", "-password");
    }

    res.json({ post });
  } catch (err) {
    res.send(err);
  }
});

//get a specific post
router.get("/:id", validateId, async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "-password")
    .populate("likes", "-password");
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  try {
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

//get post count
router.get("/post/postCount", verifyToken, isAdmin, async (req, res) => {
  const postCount = await Post.countDocuments({});
  res.send(postCount);
});

//delete post
router.delete("/:id", validateId, verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (req.user.id !== post.user._id.toString() && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ msg: "Not allowed to delete , only post's owner or admin" });
  }

  try {
    await Post.findByIdAndDelete(req.params.id);
    await removeImgCloudinary(post.postImg.publicId);
    //@TODO to remove comments of this post
    res.json({ msg: "Post has been deleted successfully" });
  } catch (err) {
    res.send(err);
  }
});

//update post
router.put(
  "/:id",
  validateId,
  verifyToken,
  uploadImgs.single("postImg"),
  async (req, res) => {
    const post = await Post.findById(req.params.id).populate("user", [
      "-password",
    ]);
    if (!post) {
      return res.status(404).json({ msg: "post is not found" });
    }

    if (req.user.id !== post.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Not allowed to update , only owner's post" });
    }
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] == "") {
        delete req.body[key];
      }
    });
    const { error } = validationUpdatePost(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    try {
      if (req.body.title) {
        post.title = req.body.title;
      }

      if (req.file) {
        await removeImgCloudinary(post.postImg.publicId);
        const pathImage = path.join(
          __dirname,
          `../images/${req.file.filename}`
        );
        const result = await uploudPostImgCloudinary(pathImage);
        post.postImg = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        fs.unlinkSync(pathImage);
      }

      if (req.body.description) {
        post.description = req.body.description;
      }
      if (req.body.category) {
        post.category = req.body.category;
      }
      await post.save();
      res.json({ msg: "post has been updated successfuly", post });
    } catch (err) {
      res.send(err);
    }
  }
);

//Toggle likes
router.put("/like/:id", validateId, verifyToken, async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "post is not found" });
  }

  const isUserAlreadyLiked = post.likes.includes(req.user.id);
  try {
    if (isUserAlreadyLiked) {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            likes: req.user.id,
          },
        },
        { new: true }
      );
    } else {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            likes: req.user.id,
          },
        },
        { new: true }
      );
    }

    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

//validation create a new post
function validationCreatePost(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(1000).optional(),

    description: Joi.string().trim().min(2).required(),

    category: Joi.string().trim(),
    postImg: Joi.object({
      url: Joi.string(),
      publicId: Joi.any(),
    }).optional(),
  });

  return schema.validate(obj);
}

//validation update post
function validationUpdatePost(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(1000).optional(),

    description: Joi.string().trim().min(2),

    category: Joi.string().trim(),
    postImg: Joi.object({
      url: Joi.string(),
      publicId: Joi.any(),
    }).optional(),
  });

  return schema.validate(obj);
}
module.exports = router;
