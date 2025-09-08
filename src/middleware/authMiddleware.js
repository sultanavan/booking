import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  logger.info(
    `Authenticating request, token: ${token ? "provided" : "not provided"}`
  );
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
