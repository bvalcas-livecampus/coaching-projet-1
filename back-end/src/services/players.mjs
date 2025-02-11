import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves a player by their email
 * @param {string} email - The player's email
 * @returns {Promise<Object>} Player object
 */
export const getPlayerByEmail = async (email) => {
  try {
    logger.info(`Retrieving player with email: ${email}`);
    const result = await pool.query('SELECT * FROM players WHERE email = $1', [email]);
    logger.info(`Retrieved player: ${result.rows[0]?.username || 'not found'}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving player with email ${email}:`, error);
    throw error;
  }
};

/**
 * Retrieves a player by their ID
 * @param {number} id - The player's ID
 * @returns {Promise<Object>} Player object
 */
export const getPlayerById = async (id) => {
  try {
    logger.info(`Retrieving player with id: ${id}`);
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    logger.info(`Retrieved player: ${result.rows[0]?.username || 'not found'}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving player with id ${id}:`, error);
    throw error;
  }
};

