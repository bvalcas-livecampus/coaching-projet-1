import { teams as teamsService } from "../services/index.mjs";

/**
 * Middleware to fetch teams based on character IDs
 * @param {import('express').Request} req - Express request object containing characters in req.characters
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Calls next() with teams added to req.teams or error if no teams found
 */
const getTeams = async (req, res, next) => {
    const teams = await teamsService.getTeamsByCharacterIds(req.characters);
    if (teams.length === 0) {
        return next({ status: 400, message: 'No teams found' });
    }
    req.teams = teams;
    next();
};

export default getTeams;
