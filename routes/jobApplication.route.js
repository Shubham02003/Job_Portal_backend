import express from "express";

import { applyForJob } from "../controllers/jobApplication.controller.js";
import verifyUserTypeAndId from "../middlewares/authUser.middleware.js";

const router = express.Router();

router.use(verifyUserTypeAndId);

// Route for job seekers to apply for a job
router.post("/", applyForJob);

export default router;
