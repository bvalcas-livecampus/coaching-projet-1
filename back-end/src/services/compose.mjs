import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Gets all composition entries for a specific team
 * @param {Object} team - The team object containing an id property
 * @returns {Promise<Array>} Array of composition entries
 */
export const getCompose = async (team) => {
  try {
    logger.info(`Getting composition entries for team ${team.id}`);
    const result = await pool.query('SELECT * FROM compose WHERE party_id = $1', [team.id]);
    logger.info(`Found ${result.rows.length} composition entries`);
    return result.rows;
  } catch (error) {
    logger.error(`Error getting composition entries: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a new composition entry linking a character to a team
 * @param {Object} team - The team object containing an id property
 * @param {Object} character - The character object containing an id property
 * @returns {Promise<Object>} The newly created compose entry
 */
export const compose = async (team, character) => {
  try {
    logger.info(`Creating composition entry for team ${team.id} with character ${character.id}`);
    const result = await pool.query('INSERT INTO compose (party_id, character_id) VALUES ($1, $2) RETURNING *', [team.id, character.id]);
    logger.info(`Composition entry created successfully`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error creating composition entry: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes all composition entries for a specific team
 * @param {Object} team - The team object containing an id property
 * @returns {Promise<Object>} The deleted compose entry
 */
export const deleteCompose = async (team) => {
  try {
    logger.info(`Deleting all composition entries for team ${team.id}`);
    const result = await pool.query('DELETE FROM compose WHERE party_id = $1 RETURNING *', [team.id]);
    logger.info(`Composition entries deleted successfully`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting composition entries: ${error.message}`);
    throw error;
  }
};




