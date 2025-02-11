import express from 'express';
import { tournament as tournamentService } from "../services/index.mjs"
import logger from '../utils/logger.mjs';

const router = express.Router();

/**
 * @route GET /tournament
 * @description Get all tournaments
 * @access Public
 * @returns {Object[]} Array of tournament objects
 */
router.get('/', async (req, res, next) => {
    try {
        logger.info('GET /tournament - Fetching all tournaments');
        const tournaments = await tournamentService.getAllTournaments();
        logger.info('GET /tournament - Successfully retrieved tournaments');
        return res.send(tournaments);
    } catch (error) {
        logger.error('GET /tournament - Error fetching tournaments:', error);
        next(error);
    }
});

/**
 * @route GET /tournament/:id
 * @description Get a specific tournament by ID
 * @param {string} id - The tournament ID
 * @access Public
 * @returns {Object} Tournament object
 */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info(`GET /tournament/${id} - Fetching tournament`);
        const tournament = await tournamentService.getTournamentById(id);
        
        if (!tournament) {
            logger.info(`GET /tournament/${id} - Tournament not found`);
            return next({ status: 404, message: 'Tournament not found' });
        }

        logger.info(`GET /tournament/${id} - Successfully retrieved tournament`);
        return res.send(tournament);
    } catch (error) {
        logger.error(`GET /tournament/${id} - Error fetching tournament:`, error);
        next(error);
    }
});


export default router;