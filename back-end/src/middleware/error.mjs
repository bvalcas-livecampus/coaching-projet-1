import logger from '../utils/logger.mjs';
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
      logger.error(`Error occurred: ${err.message}`, {
        status: err.status || 500,
        stack: err.stack,
        path: req.path,
        method: req.method
      });
      res.status(err.status || 500).send({ status: err.status || 500, message: err.message || "Internal Server Error" });
    } else {
      logger.debug('Error handler called but no error was present');
      next();
    }
  }

export default errorHandler;