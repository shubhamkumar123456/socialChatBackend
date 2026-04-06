const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    desc: {
      type: String,
    },
    media: [],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: {
      type: [
        {
          userId: {
            type: String,
            ref: "User",
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
