import express from "express";
import {
  createComment,
  expandComment,
  getComments,
  replyToExistingComment,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const commentRouter = express.Router();

commentRouter.get("/:postId/comments", authenticate, getComments);
commentRouter.post("/:postId/comments", authenticate, createComment);
commentRouter.post("/:postId/comments/:commentId/reply", authenticate, replyToExistingComment);
commentRouter.post("/:postId/comments/:commentId/expand", authenticate, expandComment);

export default commentRouter;
