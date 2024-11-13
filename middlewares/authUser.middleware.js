import jwt from "jsonwebtoken";

const verifyUserTypeAndId = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authentication token is required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userType, user } = decoded;
    // console.log(decoded);
    req.userType = userType;
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ error: "Invalid or expired token", message: error });
  }
};

export default verifyUserTypeAndId;
