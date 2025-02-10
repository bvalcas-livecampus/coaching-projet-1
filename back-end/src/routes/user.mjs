import express from 'express';
import { user as _userService } from "../services/index.mjs"
import logger from '../utils/logger.mjs';

const router = express.Router();

/**
 * @route GET /user
 * @description Get all users
 * @access Public
 */
router.get('/', async (req, res, next) => {
    try {
        logger.info('GET /user - Fetching all users');
        return res.send('Hello World!');
    } catch (error) {
        logger.error('GET /user - Error fetching all users:', error);
        next(error);
    }
});

/**
 * @route GET /user/:id
 * @description Get user by ID
 * @param {string} id - The user's ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
    try {
        logger.info(`GET /user/${req.params.id} - Fetching user by ID`);
        return res.send('Hello World!');
    } catch (error) {
        logger.error(`GET /user/${req.params.id} - Error fetching user:`, error);
        next(error);
    }
});


export default router;