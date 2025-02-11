import express from 'express';
import {
    donjons as donjonsService,
    donjonsDone as donjonsDoneService
} from '../services/index.mjs';
import logger from '../utils/logger.mjs';

const router = express.Router();

/**
 * @route GET /donjons
 * @description Get all dungeons
 * @returns {Promise<Array>} Array of dungeon objects
 */
router.get('/', async (req, res, next) => {
    try {
        logger.info('Getting all dungeons');
        const donjons = await donjonsService.getDonjons();
        return res.send(donjons);
    } catch (error) {
        logger.error('Error getting all dungeons:', error);
        return next(error);
    }
});

/**
 * @route GET /donjons/:id
 * @description Get a dungeon by ID
 * @param {string} req.params.id - Dungeon ID
 * @returns {Promise<Object>} Dungeon object
 * @throws {Error} 404 - Dungeon not found
 */
router.get('/:id', async (req, res, next) => {
    try {
        logger.info(`Getting dungeon by id: ${req.params.id}`);
        const donjon = await donjonsService.getDonjonById(req.params.id);
        if (!donjon) {
            logger.warn(`Dungeon not found with id: ${req.params.id}`);
            return next({ status: 404, message: 'Dungeon not found' });
        }
        return res.send(donjon);
    } catch (error) {
        logger.error(`Error getting dungeon ${req.params.id}:`, error);
        return next(error);
    }
});

/**
 * @route GET /donjons/level/:level
 * @description Get dungeons by minimum level
 * @param {string} req.params.level - Minimum dungeon level
 * @returns {Promise<Array>} Array of dungeon objects
 */
router.get('/level/:level', async (req, res, next) => {
    try {
        const level = parseInt(req.params.level);
        if (isNaN(level)) {
            logger.warn('Invalid level parameter provided');
            return next({ status: 400, message: 'Level must be a number' });
        }

        logger.info(`Getting dungeons with minimum level: ${level}`);
        const donjons = await donjonsService.getDonjonsByMinLevel(level);
        return res.send(donjons);
    } catch (error) {
        logger.error(`Error getting dungeons by level ${req.params.level}:`, error);
        return next(error);
    }
});

/**
 * @route GET /donjons/team/:teamId
 * @description Get dungeons completed by a specific team
 * @param {string} req.params.teamId - Team ID
 * @returns {Promise<Array>} Array of completed dungeon objects
 */
router.get('/team/:teamId', async (req, res, next) => {
    try {
        logger.info(`Getting dungeons completed by team: ${req.params.teamId}`);
        const donjons = await donjonsService.getDonjonsByTeam({ id: req.params.teamId });
        return res.send(donjons);
    } catch (error) {
        logger.error(`Error getting dungeons for team ${req.params.teamId}:`, error);
        return next(error);
    }
});

/**
 * @route POST /donjons/:id/complete
 * @description Record a dungeon completion for a team
 * @param {string} req.params.id - Dungeon ID
 * @param {Object} req.body - Request body
 * @param {number} req.body.teamId - Team ID
 * @param {number} req.body.timer - Completion time in minutes
 * @returns {Promise<Object>} Created dungeon completion record
 * @throws {Error} 404 - Dungeon not found
 * @throws {Error} 400 - Invalid request body
 */
router.post('/:id/complete', async (req, res, next) => {
    try {
        const { teamId, timer } = req.body;
        
        if (!teamId || !timer) {
            logger.warn('Missing required fields in request body');
            return next({ status: 400, message: 'Team ID and timer are required' });
        }

        logger.info(`Checking if dungeon ${req.params.id} exists`);
        const donjon = await donjonsService.getDonjonById(req.params.id);
        if (!donjon) {
            logger.warn(`Dungeon not found with id: ${req.params.id}`);
            return next({ status: 404, message: 'Dungeon not found' });
        }

        // Check if the team has already completed this dungeon
        const existingRecord = await donjonsDoneService.getDonjonDoneByTeamAndDonjonId(
            { id: teamId },
            { id: req.params.id }
        );

        if (existingRecord) {
            logger.warn(`Team ${teamId} has already completed dungeon ${req.params.id}`);
            return next({ status: 400, message: 'Team has already completed this dungeon' });
        }

        logger.info(`Recording completion for dungeon ${req.params.id} by team ${teamId}`);
        const completion = await donjonsDoneService.createDonjonDone(
            { id: teamId },
            { id: req.params.id },
            timer
        );

        return res.status(201).send(completion);
    } catch (error) {
        logger.error(`Error recording dungeon completion:`, error);
        return next(error);
    }
});

export default router;
