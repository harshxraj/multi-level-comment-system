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
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies",
        },
      },
      { $addFields: { replies: { $slice: ["$replies", 2] } } }, // Limit replies to 2
    ]);

    // Modify the data to remove unwanted fields
    const cleanedComments = comments.map((comment) => ({
      _id: comment._id,
      text: comment.text,
      postId: comment.postId,
      userId: comment.userId,
      createdAt: comment.createdAt,
      replies: comment.replies.map((reply) => ({
        _id: reply._id,
        text: reply.text,
        createdAt: reply.createdAt,
        userId: reply.userId,
      })),
    }));

    res.status(200).json(cleanedComments);
  } catch (error) {
    console.error("Failed to retrieve comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments", details: error.message });
  }
};

export const expandComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    const skip = (page - 1) * pageSize;

    const comments = await Comment.aggregate([
      // Match comments that belong to the post and are replies to the specified top-level comment
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          parentCommentId: new mongoose.Types.ObjectId(commentId),
        },
      },

      // Paginate the comments
      { $sort: { createdAt: -1 } }, // Sort comments by creation date
      { $skip: skip },
      { $limit: parseInt(pageSize) },

      // Look up the replies for each comment
      {
        $lookup: {
          from: "comments", // This should match the collection name in your database
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies",
        },
      },

      // Project the desired fields and limit the replies
      {
        $project: {
          _id: 0,
          id: "$_id",
          text: 1,
          createdAt: 1,
          postId: 1,
          parentCommentId: 1,
          replies: { $slice: ["$replies", 2] }, // Limit replies to 2
          totalReplies: { $size: "$replies" }, // Count the total number of replies
        },
      },
    ]);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in expandComment:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to expand comments" });
  }
};
