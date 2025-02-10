import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all teams from the database
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeams = async () => {
  try {
    logger.info('Retrieving all teams');
    const result = await pool.query('SELECT * FROM parties');
    logger.info(`Retrieved ${result.rows.length} teams`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving teams:', error);
    throw error;
  }
};

/**
 * Retrieves a specific team by its ID
 * @param {number} id - The ID of the team to retrieve
 * @returns {Promise<Object|null>} Team object if found, null otherwise
 */
export const getTeamById = async (id) => {
  try {
    logger.info(`Retrieving team with ID: ${id}`);
    const result = await pool.query('SELECT * FROM parties WHERE id = $1', [id]);
    logger.info(result.rows[0] ? `Team ${id} found` : `No team found with ID ${id}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving team ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves all teams where the given character is the captain
 * @param {Object} character - Character object containing an id property
 * @param {number} character.id - The ID of the character
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeamsByCaptainId = async (character) => {
  try {
    logger.info(`Retrieving teams for captain ID: ${character.id}`);
    const result = await pool.query('SELECT * FROM parties WHERE captain_id = $1', [character.id]);
    logger.info(`Found ${result.rows.length} teams for captain ${character.id}`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving teams for captain ${character.id}:`, error);
    throw error;
  }
};

/**
 * Retrieves all teams where any of the given characters is the captain
 * @param {Array<Object>} characters - Array of character objects
 * @param {number} characters[].id - The ID of each character
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeamsByCharacterIds = async (characters) => {
  try {
    const characterIds = characters.map(character => character.id);
    logger.info(`Retrieving teams for captain IDs: ${characterIds.join(', ')}`);
    const result = await pool.query('SELECT * FROM parties WHERE captain_id = ANY($1)', [characterIds]);
    logger.info(`Found ${result.rows.length} teams for the specified captains`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving teams for captains:', error);
    throw error;
  }
};

/**
 * Creates a new team with the specified leader and registered user
 * @param {Object} leader - Character object for the team captain
 * @param {number} leader.id - The ID of the leader character
 * @param {Object} registered - Registered user object
 * @param {number} registered.id - The ID of the registered user
 * @returns {Promise<Object>} Newly created team object
 */
export const createTeam = async (leader, registered) => {
  try {
    logger.info(`Creating new team with captain ID: ${leader.id} and registered user ID: ${registered.id}`);
    const result = await pool.query('INSERT INTO parties (captain_id, registered_id) VALUES ($1, $2) RETURNING *', [leader.id, registered.id]);
    logger.info(`Created new team with ID: ${result.rows[0].id}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating team:', error);
    throw error;
  }
};

/**
 * Updates an existing team's information
 * @param {Object} team - Current team object
 * @param {number} team.id - The ID of the team to update
 * @param {Object} updateTeam - Object containing the updated team data
 * @param {number} updateTeam.captain_id - The new captain ID
 * @returns {Promise<Object>} Updated team object
 */
export const updateTeam = async (team, updateTeam) => {
  try {
    logger.info(`Updating team ${team.id} with new captain ID: ${updateTeam.captain_id}`);
    const result = await pool.query('UPDATE parties SET captain_id = $1 WHERE id = $2 RETURNING *', [updateTeam.captain_id, team.id]);
    logger.info(`Team ${team.id} updated successfully`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating team ${team.id}:`, error);
    throw error;
  }
};

/**
 * Deletes a team from the database
 * @param {number} id - The ID of the team to delete
 * @returns {Promise<Object|null>} Deleted team object if found, null otherwise
 */
export const deleteTeam = async (id) => {
  try {
    logger.info(`Deleting team with ID: ${id}`);
    const result = await pool.query('DELETE FROM parties WHERE id = $1 RETURNING *', [id]);
    logger.info(result.rows[0] ? `Team ${id} deleted successfully` : `No team found with ID ${id} to delete`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting team ${id}:`, error);
    throw error;
  }
};
