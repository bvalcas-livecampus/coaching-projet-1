import pool from './bdd.mjs';

/**
 * Retrieves all teams from the database
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeams = async () => {
  const result = await pool.query('SELECT * FROM parties');
  return result.rows;
};

/**
 * Retrieves a specific team by its ID
 * @param {number} id - The ID of the team to retrieve
 * @returns {Promise<Object|null>} Team object if found, null otherwise
 */
export const getTeamById = async (id) => {
  const result = await pool.query('SELECT * FROM parties WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Retrieves all teams where the given character is the captain
 * @param {Object} character - Character object containing an id property
 * @param {number} character.id - The ID of the character
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeamsByCaptainId = async (character) => {
  const result = await pool.query('SELECT * FROM parties WHERE captain_id = $1', [character.id]);
  return result.rows;
};

/**
 * Retrieves all teams where any of the given characters is the captain
 * @param {Array<Object>} characters - Array of character objects
 * @param {number} characters[].id - The ID of each character
 * @returns {Promise<Array>} Array of team objects
 */
export const getTeamsByCharacterIds = async (characters) => {
  const characterIds = characters.map(character => character.id);
  const result = await pool.query('SELECT * FROM parties WHERE captain_id = ANY($1)', [characterIds]);
  return result.rows;
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
  const result = await pool.query('INSERT INTO parties (captain_id, registered_id) VALUES ($1, $2) RETURNING *', [leader.id, registered.id]);
  return result.rows[0];
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
  const result = await pool.query('UPDATE parties SET captain_id = $1 WHERE id = $2 RETURNING *', [updateTeam.captain_id, team.id]);
  return result.rows[0];
};

/**
 * Deletes a team from the database
 * @param {number} id - The ID of the team to delete
 * @returns {Promise<Object|null>} Deleted team object if found, null otherwise
 */
export const deleteTeam = async (id) => {
  const result = await pool.query('DELETE FROM parties WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
