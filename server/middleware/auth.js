// middleware/auth.js
import jwt from "jsonwebtoken";

export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
