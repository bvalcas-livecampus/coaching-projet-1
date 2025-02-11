import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all completed dungeons records
 * @returns {Promise<Array>} Array of completed dungeon records
 */
export const getDonjonsDone = async () => {
  try {
    logger.info('Retrieving all completed dungeons');
    const result = await pool.query('SELECT * FROM donjon_done');
    logger.info(`Retrieved ${result.rows.length} completed dungeon records`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving completed dungeons:', error);
    throw error;
  }
};

/**
 * Retrieves completed dungeon record by team and dungeon IDs
 * @param {Object} team - Team object containing an id property
 * @param {number} team.id - The ID of the team
 * @param {Object} donjon - Dungeon object containing an id property
 * @param {number} donjon.id - The ID of the dungeon
 * @returns {Promise<Object|null>} Completed dungeon record if found, null otherwise
 */
export const getDonjonDoneByTeamAndDonjonId = async (team, donjon) => {
  try {
    logger.info(`Retrieving completed dungeon record for team ${team.id} and dungeon ${donjon.id}`);
    const result = await pool.query(
      'SELECT * FROM donjon_done WHERE party_id = $1 AND donjon_id = $2',
      [team.id, donjon.id]
    );
    logger.info(result.rows[0] ? 'Record found' : 'No record found');
    return result.rows[0];
  } catch (error) {
    logger.error('Error retrieving completed dungeon record:', error);
    throw error;
  }
};

/**
 * Creates a new completed dungeon record
 * @param {Object} team - Team object containing an id property
 * @param {number} team.id - The ID of the team
 * @param {Object} donjon - Dungeon object containing an id property
 * @param {number} donjon.id - The ID of the dungeon
 * @param {number} timer - The completion time in minutes
 * @returns {Promise<Object>} Newly created completed dungeon record
 */
export const createDonjonDone = async (team, donjon, timer) => {
  try {
    logger.info(`Creating completed dungeon record for team ${team.id} and dungeon ${donjon.id}`);
    const result = await pool.query(
      'INSERT INTO donjon_done (party_id, donjon_id, timer) VALUES ($1, $2, $3) RETURNING *',
      [team.id, donjon.id, timer]
    );
    logger.info('Created new completed dungeon record');
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating completed dungeon record:', error);
    throw error;
  }
};

/**
 * Retrieves all completed dungeons for a specific team
 * @param {Object} team - Team object containing an id property
 * @param {number} team.id - The ID of the team
 * @returns {Promise<Array>} Array of completed dungeon records
 */
export const getDonjonsDoneByTeam = async (team) => {
  try {
    logger.info(`Retrieving all completed dungeons for team ${team.id}`);
    const result = await pool.query(
      'SELECT * FROM donjon_done WHERE party_id = $1',
      [team.id]
    );
    logger.info(`Found ${result.rows.length} completed dungeons for team ${team.id}`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving completed dungeons for team ${team.id}:`, error);
    throw error;
  }
};
