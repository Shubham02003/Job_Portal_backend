import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new mongoose.Schema(
  {
    website_url: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    hiring_person: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be greater than 6 letters"],
    },
  },
  { timestamps: true }
);

companySchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

companySchema.methods.createJWT = async function () {
  const userObject = this.toObject(); // Convert Mongoose document to plain JavaScript object
  delete userObject.password; 

  const token = await JWT.sign(
    { user: userObject, userType: "company" },
    process.env.JWT_SECRET,
    { expiresIn: "1w" }
  );

  return token;
};

const Company = mongoose.model("Company", companySchema);

export default Company;
