import express from 'express';
import { teams as teamsService,
  registered as registeredService,
  tournament as tournamentService,
  compose as composeService
} from "../services/index.mjs";
import charactersMiddleware from "../middleware/characters.mjs";
import teamsMiddleware from "../middleware/teams.mjs";
import logger from '../utils/logger.mjs';

const router = express.Router();

/**
 * @route GET /teams
 * @description Get all teams
 * @returns {Promise<Array>} Array of team objects
 */
router.get('/', async (req, res, next) => {
    try {
        logger.info('Getting all teams');
        const teams = await teamsService.getTeams();
        return res.send(teams);
    } catch (error) {
        logger.error('Error getting all teams:', error);
        return next(error);
    }
});

/**
 * @route GET /teams/:id
 * @description Get a team by ID
 * @param {string} req.params.id - Team ID
 * @returns {Promise<Object>} Team object
 * @throws {Error} 404 - Team not found
 */
router.get('/:id', async (req, res, next) => {
    try {
        logger.info(`Getting team by id: ${req.params.id}`);
        const team = await teamsService.getTeamById(req.params.id);
        if (!team) {
            logger.warn(`Team not found with id: ${req.params.id}`);
            return next({ status: 404, message: 'Team not found' });
        }
        return res.send(team);
    } catch (error) {
        logger.error(`Error getting team ${req.params.id}:`, error);
        return next(error);
    }
});

/**
 * @route POST /teams
 * @description Create a new team for a tournament
 * @param {Object} req.body - Request body
 * @param {string} req.body.tournament_id - Tournament ID
 * @param {Array} req.characters - Array of characters (added by charactersMiddleware)
 * @returns {Promise<Object>} Created team object
 * @throws {Object} 400 - Tournament ID is required
 * @throws {Object} 404 - Tournament not found
 */
router.post('/', charactersMiddleware, async (req, res, next) => {
    try {
        logger.info(`Creating new team for tournament: ${req.body.tournament_id}`);
        if (!req.body.tournament_id) {
            logger.warn('Tournament ID missing in team creation request');
            return next({ status: 400, message: 'Tournament ID is required' });
        }
        const tournament = await tournamentService.getTournamentById(req.body.tournament_id);
        if (!tournament) {
            logger.warn(`Tournament not found with id: ${req.body.tournament_id}`);
            return next({ status: 404, message: 'Tournament not found' });
        }
        const registered = await registeredService.registered(tournament, new Date());
        const team = await teamsService.createTeam(req.characters, registered);
        await composeService.compose(team, req.characters);
        logger.info(`Team created successfully with id: ${team.id}`);
        return res.send(team);
    } catch (error) {
        logger.error('Error creating team:', error);
        return next(error);
    }
});

/**
 * @route PUT /teams/:id
 * @description Update a team
 * @param {string} req.params.id - Team ID
 * @param {Array} req.characters - Array of characters (added by charactersMiddleware)
 * @param {Array} req.teams - Array of teams (added by teamsMiddleware)
 * @param {Object} req.body - Updated team data
 * @returns {Promise<Object>} Updated team object
 * @throws {Error} 404 - Team not found
 */
router.put('/:id', charactersMiddleware, teamsMiddleware, async (req, res, next) => {
    try {
        logger.info(`Updating team with id: ${req.params.id}`);
        const team = req.teams.find(team => team.id === req.params.id);
        if (!team) {
            logger.warn(`Team not found with id: ${req.params.id}`);
            return next({ status: 404, message: `Team with id ${req.params.id} not found` });
        }
        const updatedTeam = await teamsService.updateTeam(team, req.body);
        logger.info(`Team updated successfully: ${req.params.id}`);
        return res.send(updatedTeam);
    } catch (error) {
        logger.error(`Error updating team ${req.params.id}:`, error);
        return next(error);
    }
});

/**
 * @route DELETE /teams/:id
 * @description Delete a team and its related data
 * @param {string} req.params.id - Team ID
 * @param {Array} req.characters - Array of characters (added by charactersMiddleware)
 * @param {Array} req.teams - Array of teams (added by teamsMiddleware)
 * @returns {Promise<Object>} Deleted team object
 * @throws {Error} 404 - Team not found
 */
router.delete('/:id', charactersMiddleware, teamsMiddleware, async (req, res, next) => {
    try {
        logger.info(`Deleting team with id: ${req.params.id}`);
        const team = req.teams.find(team => team.id === req.params.id);
        if (!team) {
            logger.warn(`Team not found with id: ${req.params.id}`);
            return next({ status: 404, message: `Team with id ${req.params.id} not found` });
        }
        const deletedTeam = await teamsService.deleteTeam(team);
        const registered = await registeredService.getRegisteredByTeam(team);
        await registeredService.deleteRegistered(registered);
        await composeService.deleteCompose(team);
        logger.info(`Team deleted successfully: ${req.params.id}`);
        return res.send(deletedTeam);
    } catch (error) {
        logger.error(`Error deleting team ${req.params.id}:`, error);
        return next(error);
    }
});


export default router;