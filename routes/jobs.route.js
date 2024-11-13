import express from "express";
import verifyUserTypeAndId from "../middlewares/authUser.middleware.js";
import {
  getJobById,
  createJob,
  getJobsByCompany,
  updateJobById,
  deleteJobById,
  getAllJobs,
} from "../controllers/jobs.controller.js";

const router = express.Router();

router.get(
  "/all-jobs",
  verifyUserTypeAndId,
  (req, res, next) => {
    if (req.userType !== "company" && req.userType !== "job_seeker") {
      res.status(400).json({ message: "user is not autorized" });
    }
    next();
  },
  getAllJobs
);

router.use(verifyUserTypeAndId, (req, res, next) => {
  if (req.userType !== "company") {
    return res.status(403).json({ message: "Access denied: Companies only" });
  }
  next();
});

router.post("/", createJob);
router.get("/", getJobsByCompany);
router.get("/:id", getJobById);
router.put("/:id", updateJobById);
router.delete("/:id", deleteJobById);

export default router;
