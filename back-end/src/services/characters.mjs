import pool from './bdd.mjs';

/**
 * Retrieves all characters from the database
 * @returns {Promise<Array>} Array of character objects
 */
export const getCharacters = async () => {
  const result = await pool.query('SELECT * FROM characters');
  return result.rows;
};

/**
 * Retrieves a specific character by their ID
 * @param {number} id - The character's ID
 * @returns {Promise<Object>} Character object
 */
export const getCharacterById = async (id) => {
  const result = await pool.query('SELECT * FROM characters WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Retrieves all characters belonging to a specific user
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} Array of character objects
 */
export const getCharactersByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM characters WHERE player_id = $1', [userId]);
  return result.rows;
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
  const result = await pool.query('INSERT INTO characters (name, role_id, class_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5) RETURNING *', [character.name, character.role_id, character.class_id, character.ilvl, character.rio]);
  await pool.query('INSERT INTO belong_to (character_id, player_id) VALUES ($1, $2)', [result.rows[0].id, userId]);
  return result.rows[0];
};

/**
 * Updates a character's information
 * @param {Object} character - The character object
 * @param {number} character.id - Character ID
 * @param {string} character.name - New character name
 * @returns {Promise<Object>} Updated character object
 */
export const updateCharacter = async (character) => {
  const result = await pool.query('UPDATE characters SET name = $1 WHERE id = $2 RETURNING *', [character.name, character.id]);
  return result.rows[0];
};

/**
 * Deletes a character from the database
 * @param {Object} character - The character object
 * @param {number} character.id - Character ID
 * @returns {Promise<Object>} Deleted character object
 */
export const deleteCharacter = async (character) => {
  const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING *', [character.id]);
  return result.rows[0];
};


