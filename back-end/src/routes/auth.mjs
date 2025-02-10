import express from 'express';
const router = express.Router();

/**
 * @route GET /auth/login
 * @description Endpoint for user login
 * @access Public
 */
router.get('/login', (req, res) => {
  return res.send('Hello World!');
});

/**
 * @route GET /auth/register
 * @description Endpoint for user registration
 * @access Public
 */
router.get('/register', (req, res) => {
  return res.send('Hello World!');
});

/**
 * @route GET /auth/logout
 * @description Endpoint for user logout
 * @access Public
 */
router.get('/logout', (req, res) => {
  return res.send('Hello World!');
});

export default router;