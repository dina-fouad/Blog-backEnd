const mongoose = require("mongoose");

//User schema
let postSchema = new mongoose.Schema(
  {
    title: {
      type: String,

      trim: true,
    },

    postImg: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,

    toJSON : {virtuals : true},
    toObject : {virtuals : true}
  }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
