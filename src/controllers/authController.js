import * as authService from "../services/authService.js";
import logger from "../utils/logger.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userAuth = await authService.authenticateUser(username, password);
    if (userAuth) {
      logger.info(`User login successful: ${username}`);
      return res.json(userAuth);
    }

    const hostAuth = await authService.authenticateHost(username, password);
    if (hostAuth) {
      logger.info(`Host login successful: ${username}`);
      return res.json(hostAuth);
    }

    logger.warn(`Login failed for username: ${username}`);
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    logger.error(`Login error for ${req.body.username}: ${err.message}`);
    next(err);
  }
};
