import { teams as teamsService } from "../services/index.mjs";
import logger from '../utils/logger.mjs';

/**
 * Middleware to fetch teams based on character IDs
 * @param {import('express').Request} req - Express request object containing characters in req.characters
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Calls next() with teams added to req.teams or error if no teams found
 */
const getTeams = async (req, res, next) => {
    logger.info('Starting teams middleware');
    
    if (!req.characters) {
        logger.warn('No characters found in request');
        return next({ status: 400, message: 'No characters found' });
    }

    try {
        logger.info(`Fetching teams for characters: ${JSON.stringify(req.characters)}`);
        const teams = await teamsService.getTeamsByCharacterIds(req.characters);
        
        if (teams.length === 0) {
            logger.warn('No teams found for the given characters');
            return next({ status: 400, message: 'No teams found' });
        }

        logger.info(`Found ${teams.length} teams`);
        req.teams = teams;
        next();
    } catch (error) {
        logger.error('Error fetching teams:', error);
        next(error);
    }
};

export default getTeams;
