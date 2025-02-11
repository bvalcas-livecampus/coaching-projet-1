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
  try {
    logger.debug('Authentication middleware started');
  
    // Currently disabled path
    if (true) {
      logger.debug('Authentication check bypassed - middleware disabled');
      if (req.headers.authorization) {
        req.user = JSON.parse(req.headers.authorization)?.user;
      } else {
        logger.warn('Authentication failed - no user provided');
        return next({ status: 401, message: "Unauthorized" });
      }
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
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    throw error;
  }
};


export default verifyToken;