import Job from "../models/job.model.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company", "company_name logo"); // Populate company details if needed
    res.status(200).json({ jobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve jobs", error: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      company: req.userId,
    });
    await newJob.save();
    res
      .status(201)
      .json({ message: "Job created successfully", newJob: newJob });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Job creation failed", error: error.message });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.userId });
    const len = jobs.length;
    res.status(200).json({ jobs, "No-of-Jobs": len });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve jobs", error: error });
  }
};

// Get a single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.company.toString() !== req.userId) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ job });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve job", error: error.message });
  }
};

// Update a job
export const updateJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.company.toString() !== req.userId) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update job", error: error.message });
  }
};

// Delete a job
export const deleteJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.company.toString() !== req.userId) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }
    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete job", error: error.message });
  }
};
