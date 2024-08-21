import express from "express";
import {
  createComment,
  getComments,
  replyToExistingComment,
  expandComment,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import commentRateLimiter from "../middlewares/commentRateLimiter.js";

const commentRouter = express.Router();

commentRouter.get("/:postId/comments", authenticate, commentRateLimiter, getComments);
commentRouter.post("/:postId/comments", authenticate, commentRateLimiter, createComment);
commentRouter.post(
  "/:postId/comments/:commentId/reply",
  commentRateLimiter,
  authenticate,
  replyToExistingComment
);
commentRouter.post("/:postId/comments/:commentId/expand", commentRateLimiter, authenticate, expandComment);

export default commentRouter;
