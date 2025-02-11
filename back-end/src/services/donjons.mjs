import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all dungeons from the database
 * @returns {Promise<Array>} Array of dungeon objects
 */
export const getDonjons = async () => {
  try {
    logger.info('Retrieving all dungeons');
    const result = await pool.query('SELECT * FROM donjons');
    logger.info(`Retrieved ${result.rows.length} dungeons`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving dungeons:', error);
    throw error;
  }
};

/**
 * Retrieves a specific dungeon by its ID
 * @param {number} id - The ID of the dungeon to retrieve
 * @returns {Promise<Object|null>} Dungeon object if found, null otherwise
 */
export const getDonjonById = async (id) => {
  try {
    logger.info(`Retrieving dungeon with ID: ${id}`);
    const result = await pool.query('SELECT * FROM donjons WHERE id = $1', [id]);
    logger.info(result.rows[0] ? `Dungeon ${id} found` : `No dungeon found with ID ${id}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving dungeon ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves dungeons by minimum level
 * @param {number} level - The minimum level to filter dungeons
 * @returns {Promise<Array>} Array of dungeon objects
 */
export const getDonjonsByMinLevel = async (level) => {
  try {
    logger.info(`Retrieving dungeons with minimum level: ${level}`);
    const result = await pool.query('SELECT * FROM donjons WHERE lvl >= $1 ORDER BY lvl', [level]);
    logger.info(`Found ${result.rows.length} dungeons with level >= ${level}`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving dungeons with minimum level ${level}:`, error);
    throw error;
  }
};

/**
 * Retrieves dungeons completed by a specific team
 * @param {Object} team - Team object containing an id property
 * @param {number} team.id - The ID of the team
 * @returns {Promise<Array>} Array of dungeon objects with completion times
 */
export const getDonjonsByTeam = async (team) => {
  try {
    logger.info(`Retrieving dungeons completed by team ID: ${team.id}`);
    const result = await pool.query(`
      SELECT d.*, dd.timer as completion_time 
      FROM donjons d
      JOIN donjon_done dd ON d.id = dd.donjon_id
      WHERE dd.party_id = $1
      ORDER BY d.name
    `, [team.id]);
    logger.info(`Found ${result.rows.length} dungeons completed by team ${team.id}`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving dungeons for team ${team.id}:`, error);
    throw error;
  }
};
