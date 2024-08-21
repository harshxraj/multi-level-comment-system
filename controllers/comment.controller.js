import Comment from "../models/comment.model.js";
import mongoose from "mongoose";

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req;

    console.log(req.params, text, userId);
    const comment = new Comment({
      text,
      postId: req.params.postId,
      userId,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const replyToExistingComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req;
    const reply = new Comment({
      text,
      postId: req.params.postId,
      userId,
      parentCommentId: req.params.commentId,
    });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    // Extract query parameters
    const { sortBy = "createdAt", sortOrder = "desc", page = 1, pageSize = 10 } = req.query;

    // Convert postId to ObjectId using 'new'
    const postId = new mongoose.Types.ObjectId(req.params.postId);

    // Run the aggregation pipeline
    const comments = await Comment.aggregate([
      { $match: { postId: postId, parentCommentId: null } },
      { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: parseInt(pageSize) },

      { $addFields: { replies: { $slice: ["$replies", 2] } } }, // Limit replies to 2
    ]);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Failed to retrieve comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments", details: error.message });
  }
};
