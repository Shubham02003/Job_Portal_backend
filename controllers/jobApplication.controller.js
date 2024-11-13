// controllers/jobApplication.controller.js

import JobApplication from "../models/jobApplication.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const resume = req.user.resume;

    if (req.userType !== "job_seeker") {
      return res
        .status(403)
        .json({ message: "Access denied: Job Seekers only" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const newApplication = new JobApplication({
      jobSeeker: req.user._id,
      job: jobId,
      resume,
      coverLetter,
    });

    await newApplication.save();
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to apply for job", error: error.message });
  }
};
