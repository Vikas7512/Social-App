import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipsRouter from "./routes/relationships.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

dotenv.config(); // ✅ Load env variables

const app = express();

// Middleware

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

// Create upload middleware
const upload = multer({ storage: storage });

// POST route for file upload
app.post("/api/upload", upload.single("file"), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipsRouter);

app.listen(8080, () => {
  console.log("API working on port 8080");
});
