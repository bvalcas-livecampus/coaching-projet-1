import express from 'express';
import logger from '../utils/logger.mjs';
const router = express.Router();

/**
 * @route GET /auth/login
 * @description Endpoint for user login
 * @access Public
 */
router.get('/login', async (req, res, next) => {
  try {
    logger.info('User attempting to login');
    return res.send('Hello World!');
  } catch (error) {
    logger.error('Login error:', error);
    return next(error);
  }
});

/**
 * @route GET /auth/register
 * @description Endpoint for user registration
 * @access Public
 */
router.get('/register', async (req, res, next) => {
  try {
    logger.info('User attempting to register');
    return res.send('Hello World!');
  } catch (error) {
    logger.error('Registration error:', error);
    return next(error);
  }
});

/**
 * @route GET /auth/logout
 * @description Endpoint for user logout
 * @access Public
 */
router.get('/logout', async (req, res, next) => {
  try {
    logger.info('User attempting to logout');
    return res.send('Hello World!');
  } catch (error) {
    logger.error('Logout error:', error);
    return next(error);
  }
});

export default router;