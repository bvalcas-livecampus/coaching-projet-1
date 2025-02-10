/**
 * Express error handling middleware
 * @param {Error} err - Error object thrown from previous middleware or route handlers
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    if (err) {
      res.status(err.status || 500).send({ status: err.status || 500, message: err.message || "Internal Server Error" });
    } else {
      next();
    }
  }

export default errorHandler;