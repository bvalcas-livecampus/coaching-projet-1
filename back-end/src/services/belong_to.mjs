import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Gets all belong_to entries
 * @returns {Promise<Array>} Array of all belong_to entries
 */
export const getAllBelongTo = async () => {
  try {
    logger.info('Getting all belong_to entries');
    const result = await pool.query('SELECT * FROM belong_to');
    logger.info(`Found ${result.rows.length} belong_to entries`);
    return result.rows;
  } catch (error) {
    logger.error(`Error getting all belong_to entries: ${error.message}`);
    throw error;
  }
};

/**
 * Gets all characters belonging to a specific user
 * @param {Object} user - The user object containing an id property
 * @returns {Promise<Array>} Array of belong_to entries
 */
export const getBelongTo = async (user) => {
  try {
    logger.info(`Getting characters for user ${user.id}`);
    const result = await pool.query('SELECT * FROM belong_to WHERE player_id = $1', [user.id]);
    logger.info(`Found ${result.rows.length} characters belonging to user`);
    return result.rows;
  } catch (error) {
    logger.error(`Error getting character ownership entries: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a new belong_to entry linking a character to a user
 * @param {Object} user - The user object containing an id property
 * @param {Object} character - The character object containing an id property
 * @returns {Promise<Object>} The newly created belong_to entry
 */
export const belongTo = async (user, character) => {
  try {
    logger.info(`Creating ownership entry for user ${user.id} with character ${character.id}`);
    const result = await pool.query(
      'INSERT INTO belong_to (player_id, character_id) VALUES ($1, $2) RETURNING *',
      [user.id, character.id]
    );
    logger.info(`Ownership entry created successfully`);
    return result.rows[0];

  } catch (error) {
    logger.error(`Error creating ownership entry: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes a belong_to entry for a specific character
 * @param {Object} character - The character object containing an id property
 * @returns {Promise<Object>} The deleted belong_to entry
 */
export const deleteBelongTo = async (character) => {
  try {
    logger.info(`Deleting ownership entry for character ${character.id}`);
    const result = await pool.query(
      'DELETE FROM belong_to WHERE character_id = $1 RETURNING *',
      [character.id]
    );
    logger.info(`Ownership entry deleted successfully`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting ownership entry: ${error.message}`);
    throw error;
  }
};
