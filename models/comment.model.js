import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
