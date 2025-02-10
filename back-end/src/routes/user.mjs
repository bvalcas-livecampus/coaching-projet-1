import express from 'express';
import { user as _userService } from "../services/index.mjs"

const router = express.Router();

/**
 * @route GET /user
 * @description Get all users
 * @access Public
 */
router.get('/', (req, res) => {
    return res.send('Hello World!');
});

/**
 * @route GET /user/:id
 * @description Get user by ID
 * @param {string} id - The user's ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  return res.send('Hello World!');
});


export default router;