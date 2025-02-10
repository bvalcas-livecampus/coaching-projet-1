import pool from './bdd.mjs';

/**
 * Registers a tournament entry with the given date
 * @param {Object} tournament - The tournament object containing tournament details
 * @param {number} tournament.id - The unique identifier of the tournament
 * @param {Date} date - The registration date
 * @returns {Promise<Object>} The newly created registration record
 */
export const registered = async (tournament, date) => {
    const result = await pool.query('INSERT INTO registered (tournament_id, registration_date) VALUES ($1, $2) RETURNING *', [tournament.id, date]);
    return result.rows[0];
};

/**
 * Retrieves all registrations for a specific tournament
 * @param {Object} tournament - The tournament object containing tournament details
 * @param {number} tournament.id - The unique identifier of the tournament
 * @returns {Promise<Array>} Array of registration records for the tournament
 */
export const getRegisteredByTournament = async (tournament) => {
    const result = await pool.query('SELECT * FROM registered WHERE tournament_id = $1', [tournament.id]);
    return result.rows;
};

/**
 * Retrieves all registrations for a specific team
 * @param {Object} team - The team object containing team details
 * @param {number} team.id - The unique identifier of the team
 * @returns {Promise<Array>} Array of registration records for the team
 */
export const getRegisteredByTeam = async (team) => {
    const result = await pool.query('SELECT * FROM registered WHERE team_id = $1', [team.id]);
    return result.rows;
};

/**
 * Deletes a registration record
 * @param {Object} registered - The registration object containing registration details
 * @param {number} registered.tournament_id - The tournament ID of the registration to delete
 * @returns {Promise<Object>} The deleted registration record
 */
export const deleteRegistered = async (registered) => {
    const result = await pool.query('DELETE FROM registered WHERE tournament_id = $1 RETURNING *', [registered.tournament_id]);
    return result.rows[0];
};


