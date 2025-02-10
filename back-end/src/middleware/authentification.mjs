import jwt from "jsonwebtoken";
import logger from '../utils/logger.mjs';

/**
 * Middleware function to verify JWT authentication tokens in request headers.
 * Currently disabled (returns next() immediately).
 * When enabled, it:
 * 1. Checks for authorization token in request headers
 * 2. Verifies token using JWT_SECRET
 * 3. Adds decoded user data to request object
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
const verifyToken = (req, res, next) => {
  logger.debug('Authentication middleware started');
  
  // Currently disabled path
  if (true) {
    logger.debug('Authentication check bypassed - middleware disabled');
    return next();
  }

  const token = req.headers.authorization;
  if (!token) {
    logger.warn('Authentication failed - no token provided');
    return next({ status: 401, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn('Authentication failed - invalid token', { error: err.message });
      return next({ status: 401, message: "Unauthorized" });
    }
    logger.debug('Authentication successful', { userId: decoded.id });
    req.user = decoded;
    next();
  });
};


export default verifyToken;