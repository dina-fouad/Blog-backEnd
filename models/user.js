1;
const mongoose = require("mongoose");

//User schema
let UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true, // remove spaces
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      trim: true, // remove spaces
      minlength: 5,
      maxlength: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true, // remove spaces
      minlength: 8,
    },

    profileImage: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },

    bio: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON : {virtuals : true},
    toObject  :{virtuals : true}
  }
);
// populate posts that belongs to user
UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
