import "express-async-errors";
import * as dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { body, validationResult } from "express-validator";
import { MONGO_URL, PORT } from "./config/constant.js";

//  ROUTES
import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";

// PUBLIC FOLDER
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// MIDDLEWARE
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
// import { validateTest } from "./middleware/validationMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(typeof validateTest);

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/dist")));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

// app.post("/api/v1/test", validateTest, (req, res) => {
//   const { name } = req.body;
//   res.json({ message: `Hello ${name}` });
// });

// NOT FOUND MIDDLEWARE
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

// ERROR MIDDLEWARE
app.use(errorHandlerMiddleware);

// app.use((err, req, res, next) => {
//   const { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).json({
//     message,
//   });
//   console.log(err);
// });

// CONNECT TO DB
try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to db");
  // SERVER
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
