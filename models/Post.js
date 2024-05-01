const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema({
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
});

const postSchema = Schema(
  {
    content: { type: String, require: true },
    image: { type: String, default: "" },
    author: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },

    isDeleted: { type: Boolean, default: false, select: false },
    commentCount: { type: Number, default: 0 },
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
