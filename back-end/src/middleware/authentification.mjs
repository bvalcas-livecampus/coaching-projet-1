import jwt from "jsonwebtoken";

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
  return next();

  const token = req.headers.authorization;
  if (!token) return next({ status: 401, message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next({ status: 401, message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};


export default verifyToken;