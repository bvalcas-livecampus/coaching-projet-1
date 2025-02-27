import express from 'express';
import {
    tournament as tournamentService,
    registered as registeredService,
    teams as teamsService
} from "../services/index.mjs"
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

/**
 * @route GET /tournament/:id/teams
 * @description Get all teams registered for a specific tournament
 * @param {string} id - The tournament ID
 * @access Public
 * @returns {Object[]} Array of team objects
 */
router.get('/:id/teams', async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info(`GET /tournament/${id}/teams - Fetching teams for tournament`);
        
        // First verify tournament exists
        const tournament = await tournamentService.getTournamentById(id);
        if (!tournament) {
            logger.info(`GET /tournament/${id}/teams - Tournament not found`);
            return next({ status: 404, message: 'Tournament not found' });
        }

        // Get registered entries for this tournament
        const registeredEntries = await registeredService.getRegisteredByTournament(tournament);
        
        // Get all teams for these registrations
        const teams = [];
        for (const entry of registeredEntries) {
            if (entry.id) {
                const team = await teamsService.getTeamByRegisteredId(entry);
                if (team) {
                    teams.push(team);
                }
            }
        }

        logger.info(`GET /tournament/${id}/teams - Successfully retrieved ${teams.length} teams`);
        return res.send(teams);
    } catch (error) {
        logger.error(`GET /tournament/${id}/teams - Error fetching teams:`, error);
        next(error);
    }
});

/**
 * @route POST /tournament
 * @description Create a new tournament
 * @access Public
 * @returns {Object} Created tournament object
 */
router.post('/', async (req, res, next) => {
    try {
        const { name, start_date, end_date, cost_to_registry, description } = req.body;
        logger.info('POST /tournament - Creating new tournament');

        if (!name || !start_date || !end_date || cost_to_registry === undefined || !description) {
            return next({ status: 400, message: 'Missing required fields' });
        }

        // Check if end date is after current date and start date
        const endDate = new Date(end_date);
        const startDate = new Date(start_date);
        const now = new Date();

        if (endDate < now) {
            logger.info('POST /tournament - End date cannot be in the past');
            return next({ status: 400, message: 'End date cannot be in the past' });
        }

        if (endDate <= startDate) {
            logger.info('POST /tournament - End date must be after start date');
            return next({ status: 400, message: 'End date must be after start date' });
        }

        const tournament = await tournamentService.createTournament({
            name,
            start_date,
            end_date,
            cost_to_registry,
            description
        });

        logger.info(`POST /tournament - Successfully created tournament with id ${tournament.id}`);
        return res.status(201).send(tournament);
    } catch (error) {
        logger.error('POST /tournament - Error creating tournament:', error);
        next(error);
    }
});

/**
 * @route PUT /tournament/:id
 * @description Update an existing tournament
 * @access Public
 * @returns {Object} Updated tournament object
 */
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, start_date, end_date, cost_to_registry, description } = req.body;
        logger.info(`PUT /tournament/${id} - Updating tournament`);

        if (!name || !start_date || !end_date || cost_to_registry === undefined || !description) {
            return next({ status: 400, message: 'Missing required fields' });
        }

        // Get current tournament to check end date
        const currentTournament = await tournamentService.getTournamentById(id);
        if (!currentTournament) {
            logger.info(`PUT /tournament/${id} - Tournament not found`);
            return next({ status: 404, message: 'Tournament not found' });
        }

        // Check if tournament has already ended
        const currentEndDate = new Date(currentTournament.end_date);
        if (currentEndDate < new Date()) {
            logger.info(`PUT /tournament/${id} - Cannot update tournament that has already ended`);
            return next({ status: 400, message: 'Cannot update tournament that has already ended' });
        }

        // Check if new end date is after current date and start date
        const newEndDate = new Date(end_date);
        const newStartDate = new Date(start_date);
        const now = new Date();

        if (newEndDate < now) {
            logger.info(`PUT /tournament/${id} - End date cannot be in the past`);
            return next({ status: 400, message: 'End date cannot be in the past' });
        }

        if (newEndDate <= newStartDate) {
            logger.info(`PUT /tournament/${id} - End date must be after start date`);
            return next({ status: 400, message: 'End date must be after start date' });
        }

        const tournament = await tournamentService.updateTournament(id, {
            name,
            start_date,
            end_date,
            cost_to_registry,
            description
        });

        logger.info(`PUT /tournament/${id} - Successfully updated tournament`);
        return res.send(tournament);
    } catch (error) {
        logger.error(`PUT /tournament/${id} - Error updating tournament:`, error);
        next(error);
    }
});

/**
 * @route DELETE /tournament/:id
 * @description Delete a tournament
 * @access Public
 * @returns {Object} Deleted tournament object
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info(`DELETE /tournament/${id} - Deleting tournament`);
        // Check if tournament exists
        const currentTournament = await tournamentService.getTournamentById(id);
        if (!currentTournament) {
            logger.info(`DELETE /tournament/${id} - Tournament not found`);
            return next({ status: 404, message: 'Tournament not found' });
        }

        const tournament = await tournamentService.deleteTournament(id);
        logger.info(`DELETE /tournament/${id} - Successfully deleted tournament`);
        return res.send(tournament);
    } catch (error) {
        logger.error(`DELETE /tournament/${id} - Error deleting tournament:`, error);
        next(error);
    }
});

export default router;