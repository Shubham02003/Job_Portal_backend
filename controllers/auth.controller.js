import JobSeeker from "../models/jobSeeker.model.js";
import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

const registerController = async (req, res) => {
 
  try {
    const {
      userType,
      name,
      email,
      password,
      website_url,
      company_name,
      hiring_person,
      description,
    } = req.body;

    let resumeUrl, profilePictureUrl, logoUrl;

    // Handle Job Seeker Registration
    
    if (userType === "job_seeker") {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check for existing user by email
      const existingJobSeeker = await JobSeeker.findOne({ email });
      if (existingJobSeeker) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Upload resume and profile picture if they exist
      if (req.files?.resume) {
        try {
         
          const resumeUpload = await cloudinary.v2.uploader.upload(
            req.files.resume[0].path,
            {
              folder: "job_portal/resumes",
            }
          );
          resumeUrl = resumeUpload.secure_url;
        } catch (err) {
          console.log(err);
        }
      }

      if (req.files?.profile_picture) {
        
        try {
          const profileUpload = await cloudinary.v2.uploader.upload(
            req.files.profile_picture[0].path,
            {
              folder: "job_portal/profile_pictures",
            }
          );
          profilePictureUrl = profileUpload.secure_url;
        } catch (error) {
          console.log(error);
        }
      }

      const jobSeeker = new JobSeeker({
        name,
        email,
        password,
        resume: resumeUrl,
        profile_picture: profilePictureUrl,
      });

      await jobSeeker.save();
      const token = await jobSeeker.createJWT();
      res.status(201).json({
        message: "Job Seeker registered successfully!",
        user: {
          name,
          email,
          resume: resumeUrl,
          profile_picture: profilePictureUrl,
        },
        accessToken: token,
      });

      // Handle Company Registration
    } else if (userType === "company") {
      if (!company_name) {
        return res.status(400).json({ error: "Company name is required" });
      }

      const existingCompany = await Company.findOne({ company_name });
      if (existingCompany) {
        return res.status(400).json({ error: "Company already registered" });
      }

      // Upload logo if it exists
      if (req.files?.logo) {
        try {
          const logoUpload = await cloudinary.v2.uploader.upload(
            req.files.logo[0].path,
            {
              folder: "job_portal/logos",
            }
          );
          logoUrl = logoUpload.secure_url;
        } catch (error) {
          console.log(error);
        }
      }

      const newCompany = new Company({
        website_url,
        company_name,
        hiring_person,
        logo: logoUrl,
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
          logo: logoUrl,
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
