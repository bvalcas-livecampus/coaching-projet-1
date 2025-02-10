import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Registers a tournament entry with the given date
 * @param {Object} tournament - The tournament object containing tournament details
 * @param {number} tournament.id - The unique identifier of the tournament
 * @param {Date} date - The registration date
 * @returns {Promise<Object>} The newly created registration record
 */
export const registered = async (tournament, date) => {
    logger.info(`Registering new tournament entry for tournament ID: ${tournament.id}`);
    try {
        const result = await pool.query('INSERT INTO registered (tournament_id, registration_date) VALUES ($1, $2) RETURNING *', [tournament.id, date]);
        logger.info(`Successfully registered tournament ID: ${tournament.id}`);
        return result.rows[0];
    } catch (error) {
        logger.error(`Error registering tournament ID ${tournament.id}: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves all registrations for a specific tournament
 * @param {Object} tournament - The tournament object containing tournament details
 * @param {number} tournament.id - The unique identifier of the tournament
 * @returns {Promise<Array>} Array of registration records for the tournament
 */
export const getRegisteredByTournament = async (tournament) => {
    logger.info(`Fetching registrations for tournament ID: ${tournament.id}`);
    try {
        const result = await pool.query('SELECT * FROM registered WHERE tournament_id = $1', [tournament.id]);
        logger.info(`Found ${result.rows.length} registrations for tournament ID: ${tournament.id}`);
        return result.rows;
    } catch (error) {
        logger.error(`Error fetching registrations for tournament ID ${tournament.id}: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves all registrations for a specific team
 * @param {Object} team - The team object containing team details
 * @param {number} team.id - The unique identifier of the team
 * @returns {Promise<Array>} Array of registration records for the team
 */
export const getRegisteredByTeam = async (team) => {
    logger.info(`Fetching registrations for team ID: ${team.id}`);
    try {
        const result = await pool.query('SELECT * FROM registered WHERE team_id = $1', [team.id]);
        logger.info(`Found ${result.rows.length} registrations for team ID: ${team.id}`);
        return result.rows;
    } catch (error) {
        logger.error(`Error fetching registrations for team ID ${team.id}: ${error.message}`);
        throw error;
    }
};

/**
 * Deletes a registration record
 * @param {Object} registered - The registration object containing registration details
 * @param {number} registered.tournament_id - The tournament ID of the registration to delete
 * @returns {Promise<Object>} The deleted registration record
 */
export const deleteRegistered = async (registered) => {
    logger.info(`Deleting registration for tournament ID: ${registered.tournament_id}`);
    try {
        const result = await pool.query('DELETE FROM registered WHERE tournament_id = $1 RETURNING *', [registered.tournament_id]);
        logger.info(`Successfully deleted registration for tournament ID: ${registered.tournament_id}`);
        return result.rows[0];
    } catch (error) {
        logger.error(`Error deleting registration for tournament ID ${registered.tournament_id}: ${error.message}`);
        throw error;
    }
};


