import express from 'express';
import { tournament as _tournamentService } from "../services/index.mjs"

const router = express.Router();

/**
 * @route GET /tournament
 * @description Get all tournaments
 * @access Public
 * @returns {Object[]} Array of tournament objects
 */
router.get('/', async (req, res) => {
    res.send('Hello World!');
});

/**
 * @route GET /tournament/:id
 * @description Get a specific tournament by ID
 * @param {string} id - The tournament ID
 * @access Public
 * @returns {Object} Tournament object
 */
router.get('/:id', (req, res) => {
  res.send('Hello World!');
});


export default router;