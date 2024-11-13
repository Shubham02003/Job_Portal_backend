import JobSeeker from "../models/jobSeeker.model.js";
import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
const registerController = async (req, res) => {
  try {
    const {
      userType,
      name,
      email,
      password,
      resume,
      profile_picture,
      website_url,
      company_name,
      hiring_person,
      logo,
      description,
    } = req.body;

    if (userType === "job_seeker") {
      if (!email) {
        return res.status(400).json({ error: "email is required" });
      }
      const exitJobSeerker = await JobSeeker.findOne({ email });
      if (exitJobSeerker) {
        return res.status(400).json({
          error: "This email Already exits Please login",
          success: false,
        });
      }
      const jobSeeker = new JobSeeker({
        name,
        email,
        password,
        resume,
        profile_picture,
      });

      await jobSeeker.save();
      const token = await jobSeeker.createJWT();
      res.status(201).json({
        message: "Job Seeker registered successfully!",
        user: {
          name,
          email,
          resume,
          profile_picture,
        },
        accessToken: token,
      });
    } else if (userType === "company") {
      if (!company_name) {
        return res.status(400).json({ error: "Company is required" });
      }
      const exitCompany = await Company.findOne({ company_name });
      if (exitCompany) {
        return res.status(400).json({
          error: "This Company Already exits Please login",
          success: false,
        });
      }
      const newCompany = new Company({
        website_url,
        company_name,
        hiring_person,
        logo,
        description,
        password,
      });

      await newCompany.save();
      const token = await newCompany.createJWT();
      res.status(201).json({
        message: "Company registered successfully!",
        company: {
          company_name,
          website_url,
          hiring_person,
          logo,
          description,
        },
        accessToken: token,
      });
    } else {
      res.status(400).json({ message: "Invalid user type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { userType, email, password, company_name } = req.body;

    if (userType === "job_seeker") {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const jobSeeker = await JobSeeker.findOne({ email });
      if (!jobSeeker) {
        return res.status(404).json({ error: "Email Does not exits" });
      }

      const isMatch = await bcrypt.compare(password, jobSeeker.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = await jobSeeker.createJWT();
      res.status(200).json({
        message: "Login successful",
        user: {
          name: jobSeeker.name,
          email: jobSeeker.email,
          resume: jobSeeker.resume,
          profile_picture: jobSeeker.profile_picture,
        },
        accessToken: token,
      });
    } else if (userType === "company") {
      if (!company_name || !password) {
        return res
          .status(400)
          .json({ error: "Company name and password are required" });
      }

      const company = await Company.findOne({ company_name });
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = await company.createJWT();
      res.status(200).json({
        message: "Login successful",
        company: {
          company_name: company.company_name,
          website_url: company.website_url,
          hiring_person: company.hiring_person,
          logo: company.logo,
          description: company.description,
        },
        accessToken: token,
      });
    } else {
      res.status(400).json({ error: "Invalid userType" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

export { registerController, loginController };
