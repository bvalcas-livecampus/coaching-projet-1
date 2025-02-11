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
 * Retrieves a registration record by its ID
 * @param {number} id - The unique identifier of the registration
 * @returns {Promise<Object|null>} The registration record if found, null otherwise
 */
export const getRegisteredById = async (id) => {
    logger.info(`Fetching registration with ID: ${id}`);
    try {
        const result = await pool.query('SELECT * FROM registered WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            logger.info(`No registration found with ID: ${id}`);
            return null;
        }
        logger.info(`Successfully retrieved registration with ID: ${id}`);
        return result.rows[0];
    } catch (error) {
        logger.error(`Error fetching registration with ID ${id}: ${error.message}`);
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
