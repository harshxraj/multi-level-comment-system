import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import connection from "./db/connection.js";
import commentRouter from "./routes/comments.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", commentRouter);

app.listen(PORT, () => {
  connection();
  console.log(`Server is listening at http://localhost:${PORT}`);
});
