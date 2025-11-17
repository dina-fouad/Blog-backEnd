const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const validateId = require("../middlewares/validateObjectId");
const Joi = require("joi");

const router = express.Router();

// create comment
router.post("/", verifyToken, async (req, res) => {
  const { error } = validationCreateComment(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  const postId = await Post.findById(req.body.post);
  if (!postId) {
    return res.status(404).json({ msg: "post not found" });
  }
  const user = await User.findById(req.user.id);
  try {
    const comment = await new Comment({
      post: req.body.post,
      user: user._id,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).json({ msg: "Comment has been created", comment });
  } catch (err) {
    res.send(err);
  }
});

// get all comments
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", [
        "-password",
        "-bio",
        "-isAdmin",
        "-isAccountVerified",
        "-createdAt",
        "-updatedAt",
        "-__v",
      ])
      .populate("likesComment", [
        "-password",
        "-bio",
        "-isAdmin",
        "-isAccountVerified",
        "-createdAt",
        "-updatedAt",
        "-__v",
      ]);
    res.send(comments);
  } catch (error) {
    res.send(error);
  }
});

//delete comment
router.delete("/:id", validateId, verifyToken, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ msg: "Comment not found" });
  }

  try {
    if (comment.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ msg: "Not allowed , only owner's comment or admin" });
    } else {
      await Comment.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ msg: "comment has been deleted successfuly" });
    }
  } catch (err) {
    res.send(err);
  }
});

//update comment
router.put("/:id", validateId, verifyToken, async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ msg: "Comment not found" });
  }
  try {
    if (comment.user._id.toString() === req.user.id) {
      comment.text = req.body.text;
      await comment.save();
      return res.status(200).json({ msg: "Comment has been Updated", comment });
    } else {
      return res
        .status(403)
        .json({ msg: "Not allowed , only owoner's comment" });
    }
  } catch (error) {
    return res.send(error);
  }
});

//Toggle likesComment
router.put("/likesComment/:id", validateId, verifyToken, async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ msg: "Comment is not found" });
  }

  const isUserAlreadyLiked = comment.likesComment.includes(req.user.id);
  try {
    if (isUserAlreadyLiked) {
      comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            likesComment: req.user.id,
          },
        },
        { new: true }
      );
    } else {
      comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            likesComment: req.user.id,
          },
        },
        { new: true }
      );
    }

    res.send(comment);
  } catch (err) {
    res.send(err);
  }
});

//validation create comment
function validationCreateComment(obj) {
  const schema = Joi.object({
    post: Joi.string().required().label("Post id"),

    text: Joi.string().trim().required(),
  });

  return schema.validate(obj);
}
module.exports = router;
