import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "resume" },
    { name: "logo" },
    { name: "profile_picture" },
  ]),
  registerController
);

router.post(
  "/test",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.send("file uploaded");
  }
);

router.post("/login", loginController);

export default router;
