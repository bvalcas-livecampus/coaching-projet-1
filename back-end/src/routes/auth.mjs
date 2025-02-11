import express from 'express';
import logger from '../utils/logger.mjs';
import { players } from '../services/index.mjs';
const router = express.Router();

/**
 * @route POST /auth/login
 * @description Endpoint for user login
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    logger.info('User attempting to login');
    const { email, password } = req.body;
    if (!email) {
      logger.warn('Login attempt missing email');
      return next({ status: 400, message: 'Email is required' });
    }
    if (!password) {
      logger.warn('Login attempt missing password'); 
      return next({ status: 400, message: 'Password is required' });
    }
    logger.info(`Attempting login for email: ${email}`);
    const player = await players.getPlayerByEmail(email);
    if (!player) {
      logger.warn(`Login failed - no user found for email: ${email}`);
      return next({ status: 401, message: 'Invalid credentials' });
    }
    if (player.password !== password) {
      logger.warn(`Login failed - invalid password for email: ${email}`);
      return next({ status: 401, message: 'Invalid credentials' });
    }
    /*
      const token = jwt.sign({
        id: player.id,
        email: player.email,
        username: player.username,
        role: player.role
      }, process.env.JWT_SECRET);
    */
    logger.info(`Login successful for user: ${player.username}`);
    return res.send({ token: { user: player } });
  } catch (error) {
    logger.error('Login error:', error);
    return next(error);
  }
});

/**
 * @route POST /auth/register
 * @description Endpoint for user registration
 * @access Public
 */
router.post('/register', async (req, res, next) => {
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