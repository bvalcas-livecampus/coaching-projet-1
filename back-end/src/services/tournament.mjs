import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all tournaments from the database
 * @returns {Promise<Array>} Array of tournament objects
 */
export const getAllTournaments = async () => {
  try {
    logger.info('Retrieving all tournaments');
    const result = await pool.query('SELECT id, name, start_date, end_date FROM tournament ORDER BY start_date');
    logger.info(`Retrieved ${result.rows.length} tournaments`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving tournaments: ${error.message}`);
    throw error;
  }
};

/**
 * Retrieves a specific tournament by its ID
 * @param {number} id - The ID of the tournament to retrieve
 * @returns {Promise<Object|null>} Tournament object if found, null otherwise
 */
export const getTournamentById = async (id) => {
  try {
    logger.info(`Retrieving tournament with id ${id}`);
    const result = await pool.query('SELECT * FROM tournament WHERE id = $1', [id]);
    logger.info(result.rows[0] ? `Tournament ${id} found` : `Tournament ${id} not found`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving tournament ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a new tournament in the database
 * @param {Object} tournament - The tournament object to create
 * @param {string} tournament.name - The name of the tournament
 * @returns {Promise<Object>} The created tournament object
 */
export const createTournament = async (tournament) => {
  try {
    logger.info(`Creating new tournament with name: ${tournament.name}`);
    const result = await pool.query(
      'INSERT INTO tournament (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
      [tournament.name, tournament.start_date, tournament.end_date]
    );
    logger.info(`Created tournament with id ${result.rows[0].id}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error creating tournament: ${error.message}`);
    throw error;
  }
};

/**
 * Updates an existing tournament in the database
 * @param {number} id - The ID of the tournament to update
 * @param {Object} tournament - The tournament object with updated values
 * @param {string} tournament.name - The new name of the tournament
 * @returns {Promise<Object|null>} Updated tournament object if found, null otherwise
 */
export const updateTournament = async (id, tournament) => {
  try {
    logger.info(`Updating tournament ${id} with name: ${tournament.name}`);
    const result = await pool.query('UPDATE tournament SET name = $1 WHERE id = $2 RETURNING *', [tournament.name, id]);
    logger.info(result.rows[0] ? `Tournament ${id} updated` : `Tournament ${id} not found`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating tournament ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes a tournament from the database
 * @param {number} id - The ID of the tournament to delete
 * @returns {Promise<Object|null>} Deleted tournament object if found, null otherwise
 */
export const deleteTournament = async (id) => {
  try {
    logger.info(`Deleting tournament ${id}`);
    const result = await pool.query('DELETE FROM tournament WHERE id = $1 RETURNING *', [id]);
    logger.info(result.rows[0] ? `Tournament ${id} deleted` : `Tournament ${id} not found`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting tournament ${id}: ${error.message}`);
    throw error;
  }
};

