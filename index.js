import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoDB } from "./Db/conne.js";

import authRoute from "./routes/auth.route.js";
import jobRoute from "./routes/jobs.route.js";
import jobApplicationRoute from "./routes/jobApplication.route.js";
import cloudinary from "cloudinary";

const app = express();
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routes
app.use("/auth", authRoute);
app.use("/jobs", jobRoute);
app.use("/apply", jobApplicationRoute);

// erorr middlewares
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!", message: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  try {
    const connection = connectToMongoDB();
    console.log("connect to MongoDB");
  } catch (err) {
    console.log("falied to connect to MongoDB: ", err);
  }
  console.log(`app is running at port ${PORT}`);
});
