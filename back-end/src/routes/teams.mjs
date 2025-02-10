import express from 'express';
import { teams as teamsService,
  registered as registeredService,
  tournament as tournamentService,
  compose as composeService
} from "../services/index.mjs";
import charactersMiddleware from "../middleware/characters.mjs";
import teamsMiddleware from "../middleware/teams.mjs";

const router = express.Router();

/**
 * @route GET /teams
 * @description Get all teams
 * @returns {Promise<Array>} Array of team objects
 */
router.get('/', async (req, res) => {
    const teams = await teamsService.getTeams();
    res.send(teams);
});

/**
 * @route GET /teams/:id
 * @description Get a team by ID
 * @param {string} req.params.id - Team ID
 * @returns {Promise<Object>} Team object
 * @throws {Error} 404 - Team not found
 */
router.get('/:id', async (req, res) => {
    const team = await teamsService.getTeamById(req.params.id);
    if (!team) {
        return next({ status: 404, message: 'Team not found' });
    }
    res.send(team);
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
    if (!req.body.tournament_id) {
        return next({ status: 400, message: 'Tournament ID is required' });
    }
    const tournament = await tournamentService.getTournamentById(req.body.tournament_id);
    if (!tournament) {
        return next({ status: 404, message: 'Tournament not found' });
    }
    const registered = await registeredService.registered(tournament, new Date());
    const team = await teamsService.createTeam(req.characters, registered);
    await composeService.compose(team, req.characters);
    res.send(team);
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
    const team = req.teams.find(team => team.id === req.params.id);
    if (!team) {
        return next({ status: 404, message: `Team with id ${req.params.id} not found` });
    }
    const updatedTeam = await teamsService.updateTeam(team, req.body);
    res.send(updatedTeam);
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
    const team = req.teams.find(team => team.id === req.params.id);
    if (!team) {
        return next({ status: 404, message: `Team with id ${req.params.id} not found` });
    }
    const deletedTeam = await teamsService.deleteTeam(team);
    const registered = await registeredService.getRegisteredByTeam(team);
    await registeredService.deleteRegistered(registered);
    await composeService.deleteCompose(team);
    res.send(deletedTeam);
});


export default router;