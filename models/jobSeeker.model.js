import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const jobSeekerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be greater than 6 letters"],
    },
    resume: {
      type: String,
      required: false,
    },
    profile_picture: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

jobSeekerSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

jobSeekerSchema.methods.createJWT = async function () {
  const userObject = this.toObject(); // Convert Mongoose document to plain JavaScript object
  delete userObject.password;

  const token = await JWT.sign(
    { user: userObject, userType: "job_seeker" },
    process.env.JWT_SECRET,
    { expiresIn: "1w" }
  );

  return token;
};

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

export default JobSeeker;
