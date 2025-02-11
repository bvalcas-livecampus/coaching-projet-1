import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves all characters from the database
 * @returns {Promise<Array>} Array of character objects
 */
export const getCharacters = async () => {
  try {
    logger.info('Retrieving all characters');
    const result = await pool.query('SELECT * FROM characters');
    logger.info(`Retrieved ${result.rows.length} characters`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving characters:', error);
    throw error;
  }
};

/**
 * Retrieves a specific character by their ID
 * @param {number} id - The character's ID
 * @returns {Promise<Object>} Character object
 */
export const getCharacterById = async (id) => {
  try {
    logger.info(`Retrieving character with ID: ${id}`);
    const result = await pool.query('SELECT * FROM characters WHERE id = $1', [id]);
    logger.info(`Retrieved character: ${result.rows[0]?.name || 'not found'}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving character with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves multiple characters by their IDs
 * @param {Array<number>} ids - Array of character IDs
 * @returns {Promise<Array>} Array of character objects
 */
export const getCharactersByIds = async (ids) => {
  try {
    logger.info(`Retrieving characters with IDs: ${ids.join(', ')}`);
    const result = await pool.query('SELECT * FROM characters WHERE id = ANY($1)', [ids]);
    logger.info(`Retrieved ${result.rows.length} characters`);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving characters by IDs:', error);
    throw error;
  }
};

/**
 * Retrieves all characters belonging to a specific user
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} Array of character objects
 */
export const getCharactersByUserId = async (userId) => {
  try {
    logger.info(`Retrieving characters for user ID: ${userId}`);
    const result = await pool.query('SELECT * FROM characters WHERE id = $1', [userId]);
    logger.info(`Retrieved ${result.rows.length} characters for user ${userId}`);
    return result.rows;
  } catch (error) {
    logger.error(`Error retrieving characters for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Creates a new character and associates it with a user
 * @param {Object} character - The character object
 * @param {string} character.name - Character name
 * @param {number} character.role_id - Role ID
 * @param {number} character.class_id - Class ID
 * @param {number} character.ilvl - Item level
 * @param {number} character.rio - Raider.IO score
 * @param {number} userId - The user's ID
 * @returns {Promise<Object>} Created character object
 */
export const createCharacter = async (character, userId) => {
  try {
    logger.info(`Creating new character "${character.name}" for user ${userId}`);
    const result = await pool.query(
      'INSERT INTO characters (name, role_id, class_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [character.name, character.role_id, character.class_id, character.ilvl, character.rio]
    );
    await pool.query('INSERT INTO belong_to (character_id, player_id) VALUES ($1, $2)', [result.rows[0].id, userId]);
    logger.info(`Created character "${character.name}" with ID: ${result.rows[0].id}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error creating character "${character.name}":`, error);
    throw error;
  }
};

/**
 * Updates a character's information
 * @param {Object} character - The character object
 * @param {number} character.id - Character ID
 * @param {string} character.name - New character name
 * @returns {Promise<Object>} Updated character object
 */
export const updateCharacter = async (character) => {
  try {
    logger.info(`Updating character with ID: ${character.id}`);
    const result = await pool.query(
      'UPDATE characters SET name = $1 WHERE id = $2 RETURNING *',
      [character.name, character.id]
    );
    logger.info(`Updated character name to: ${result.rows[0].name}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating character ${character.id}:`, error);
    throw error;
  }
};

/**
 * Deletes a character from the database
 * @param {Object} character - The character object
 * @param {number} character.id - Character ID
 * @returns {Promise<Object>} Deleted character object
 */
export const deleteCharacter = async (character) => {
  try {
    logger.info(`Deleting character with ID: ${character.id}`);
    const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING *', [character.id]);
    logger.info(`Deleted character: ${result.rows[0].name}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting character ${character.id}:`, error);
    throw error;
  }
};


