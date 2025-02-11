import express from 'express';
import { teams as teamsService,
  registered as registeredService,
  tournament as tournamentService,
  characters as charactersService,
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
 * @route GET /teams/:id/characters
 * @description Get all characters in a team
 * @param {string} req.params.id - Team ID
 * @returns {Promise<Array>} Array of character objects
 * @throws {Error} 404 - Team not found
 */
router.get('/:id/characters', async (req, res, next) => {
    try {
        logger.info(`Getting characters for team: ${req.params.id}`);
        const team = await teamsService.getTeamById(req.params.id);
        if (!team) {
            logger.warn(`Team not found with id: ${req.params.id}`);
            return next({ status: 404, message: 'Team not found' });
        }
        logger.info(`Found team ${team.id}`);

        const characters = await composeService.getCompose(team);
        logger.info(`Found ${characters.length} composition entries for team ${team.id}`);

        const characterIds = characters.map(compose => compose.character_id);
        logger.info(`Extracted character IDs: ${characterIds.join(', ')}`);

        const result = await charactersService.getCharactersByIds(characterIds);
        logger.info(`Retrieved ${result.length} characters for team ${team.id}`);
        return res.send(result);
    } catch (error) {
        logger.error(`Error getting characters for team ${req.params.id}:`, error);
        return next(error);
    }
});


/**
 * @route POST /teams
 * @description Create a new team for a tournament
 * @param {Object} req.body - Request body
 * @param {Object} req.body.tournament - Tournament object
 * @param {Object} req.body.character - Character object
 * @param {Object} req.body.team - Team object
 * @returns {Promise<Object>} Created team object
 * @throws {Object} 400 - Tournament or character missing
 * @throws {Object} 404 - Tournament not found
 */
router.post('/', async (req, res, next) => {
    try {
        const { tournament, character, team: _team } = req.body;
        
        logger.info(`Creating new team for tournament: ${tournament?.id}`);
        
        if (!tournament) {
            logger.warn('Tournament object missing in team creation request');
            return next({ status: 400, message: 'Tournament object is required' });
        }

        if (!character) {
            logger.warn('Character object missing in team creation request'); 
            return next({ status: 400, message: 'Character object is required' });
        }
/*
        if (!_team) {
            logger.warn('Team object missing in team creation request');
            return next({ status: 400, message: 'Team object is required' });
        }
*/

        const tournamentExists = await tournamentService.getTournamentById(tournament.id);
        if (!tournamentExists) {
            logger.warn(`Tournament not found with id: ${tournament.id}`);
            return next({ status: 404, message: 'Tournament not found' });
        }
        const characterExists = await charactersService.getCharacterById(character.id);
        if (!characterExists) {
            logger.warn(`Character not found with id: ${character.id}`);
            return next({ status: 404, message: 'Character not found' });
        }
        
        const registered = await registeredService.registered(tournament, new Date());
        const party = await teamsService.createTeam(character, registered);
        await composeService.compose(party, character);
        logger.info(`Team created successfully with id: ${party.id}`);
        return res.send(party);
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

/**
 * @route PUT /teams/:id/add-members
 * @description Add members to an existing team
 * @param {string} req.params.id - Team ID
 * @param {Array} req.body.members - Array of character IDs to add
 * @returns {Promise<Object>} Updated team object
 * @throws {Error} 404 - Team not found
 */
router.put('/:id/add-members', async (req, res, next) => {
    try {
        const members = req.body.members;
        if (!members || !Array.isArray(members)) {
            logger.warn('Invalid or missing members array in request body');
            return next({ status: 400, message: 'Members array is required' });
        }

        logger.info(`Adding members to team with id: ${req.params.id}`);
        const team = await teamsService.getTeamById(req.params.id);
        
        if (!team) {
            logger.warn(`Team not found with id: ${req.params.id}`);
            return next({ status: 404, message: `Team with id ${req.params.id} not found` });
        }

        // Get existing team members
        const existingMembers = await composeService.getTeamMembers(team.id);
        const updatedTeam = { ...team };

        for (const member of members) {
            // Validate member object has id
            if (!member.id) {
                logger.warn('Member object missing id');
                continue;
            }

            // Check if member already exists in team
            if (existingMembers.some(existing => existing.id === member.id)) {
                logger.warn(`Member ${member.id} already exists in team ${team.id}`);
                continue;
            }

            const teamMember = await charactersService.getCharacterById(member.id);
            if (!teamMember) {
                logger.warn(`Team member ${member.id} not found in team update request`);
            } else {
                await composeService.compose(team, teamMember);
                logger.info(`Team member ${member.id} added to team ${team.id}`);
            }
        }

        return res.send(updatedTeam);
    } catch (error) {
        logger.error(`Error adding members to team ${req.params.id}:`, error);
        return next(error);
    }
});


export default router;