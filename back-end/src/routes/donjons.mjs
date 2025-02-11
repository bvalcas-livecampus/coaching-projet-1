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
        
        const donjonsDone = await donjonsDoneService.getDonjonsDoneByTeam({ id: req.params.teamId });
        const donjonsIds = donjonsDone.map(donjon => donjon.donjon_id);
        
        const donjons = await donjonsService.getDonjonsByIds(donjonsIds);
        const donjonsWithCompletionTime = donjons.map(donjon => {
            const completion = donjonsDone.find(done => done.donjon_id === donjon.id);
            return {
                ...donjon,
                completion_time: completion ? completion.timer : null
            };
        });
        
        return res.send(donjonsWithCompletionTime);
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
 * @param {Object} req.body.team - Team object
 * @param {number} req.body.team.id - Team ID
 * @param {Object} req.body.donjon - Dungeon object
 * @param {number} req.body.donjon.timer - Completion time in minutes
 * @returns {Promise<Object>} Created dungeon completion record
 * @throws {Error} 404 - Dungeon not found
 * @throws {Error} 400 - Invalid request body
 */
router.post('/:id/complete', async (req, res, next) => {
    try {
        const { team, donjon: donjon_tmp } = req.body;
        
        if (!team || !donjon_tmp) {
            logger.warn('Missing required fields in request body');
            return next({ status: 400, message: 'Team and timer are required' });
        }
        const donjon = Object.assign(donjon_tmp, { id: req.params.id });
        
        logger.info(`Checking if dungeon ${donjon.id} exists`);
        const donjonExists = await donjonsService.getDonjonById(donjon.id);
        if (!donjonExists) {
            logger.warn(`Dungeon not found with id: ${donjon.id}`);
            return next({ status: 404, message: 'Dungeon not found' });
        }

        const existingRecord = await donjonsDoneService.getDonjonDoneByTeamAndDonjonId(team, donjon);
        if (existingRecord) {
            logger.info(`Team ${team.id} has already completed dungeon ${donjon.id} ${existingRecord.length} time(s)`);
        }

        logger.info(`Recording completion for dungeon ${donjon.id} by team ${team.id}`);
        const completion = await donjonsDoneService.createDonjonDone(team, donjon);

        return res.status(201).send(completion);
    } catch (error) {
        logger.error(`Error recording dungeon completion:`, error);
        return next(error);
    }
});

export default router;
