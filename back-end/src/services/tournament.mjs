import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all non-deleted tournaments from the database
 * @returns {Promise<Array>} Array of tournament objects
 */
export const getAllTournaments = async () => {
  try {
    logger.info('Retrieving all non-deleted tournaments');
    const result = await pool.query('SELECT id, name, start_date, end_date FROM tournament WHERE deleted = false ORDER BY start_date');
    logger.info(`Retrieved ${result.rows.length} tournaments`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving tournaments: ${error.message}`);
    throw error;
  }
};

/**
 * Retrieves a specific non-deleted tournament by its ID
 * @param {number} id - The ID of the tournament to retrieve
 * @returns {Promise<Object|null>} Tournament object if found, null otherwise
 */
export const getTournamentById = async (id) => {
  try {
    logger.info(`Retrieving tournament with id ${id}`);
    const result = await pool.query('SELECT * FROM tournament WHERE id = $1 AND deleted = false', [id]);
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
 * @param {Date} tournament.start_date - The start date of the tournament
 * @param {Date} tournament.end_date - The end date of the tournament
 * @param {number} tournament.cost_to_registry - The registration cost
 * @param {string} tournament.description - The tournament description
 * @returns {Promise<Object>} The created tournament object
 */
export const createTournament = async (tournament) => {
  try {
    logger.info(`Creating new tournament with name: ${tournament.name}`);
    const result = await pool.query(
      'INSERT INTO tournament (name, start_date, end_date, cost_to_registry, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tournament.name, tournament.start_date, tournament.end_date, tournament.cost_to_registry, tournament.description]
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
    logger.info(`Updating tournament ${id}`);
    const result = await pool.query(
      'UPDATE tournament SET name = $1, start_date = $2, end_date = $3, cost_to_registry = $4, description = $5 WHERE id = $6 RETURNING *',
      [tournament.name, tournament.start_date, tournament.end_date, tournament.cost_to_registry, tournament.description, id]
    );
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
    logger.info(`Marking tournament ${id} as deleted`);
    const result = await pool.query(
      'UPDATE tournament SET deleted = true WHERE id = $1 RETURNING *',
      [id]
    );
    logger.info(result.rows[0] ? `Tournament ${id} marked as deleted` : `Tournament ${id} not found`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting tournament ${id}: ${error.message}`);
    throw error;
  }
};

