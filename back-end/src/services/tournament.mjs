import pool from './bdd.mjs';

/**
 * Retrieves all tournaments from the database
 * @returns {Promise<Array>} Array of tournament objects
 */
export const getTournament = async () => {
  const result = await pool.query('SELECT * FROM tournament');
  return result.rows;
};

/**
 * Retrieves a specific tournament by its ID
 * @param {number} id - The ID of the tournament to retrieve
 * @returns {Promise<Object|null>} Tournament object if found, null otherwise
 */
export const getTournamentById = async (id) => {
  const result = await pool.query('SELECT * FROM tournament WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Creates a new tournament in the database
 * @param {Object} tournament - The tournament object to create
 * @param {string} tournament.name - The name of the tournament
 * @returns {Promise<Object>} The created tournament object
 */
export const createTournament = async (tournament) => {
  const result = await pool.query('INSERT INTO tournament (name) VALUES ($1) RETURNING *', [tournament.name]);
  return result.rows[0];
};

/**
 * Updates an existing tournament in the database
 * @param {number} id - The ID of the tournament to update
 * @param {Object} tournament - The tournament object with updated values
 * @param {string} tournament.name - The new name of the tournament
 * @returns {Promise<Object|null>} Updated tournament object if found, null otherwise
 */
export const updateTournament = async (id, tournament) => {
  const result = await pool.query('UPDATE tournament SET name = $1 WHERE id = $2 RETURNING *', [tournament.name, id]);
  return result.rows[0];
};

/**
 * Deletes a tournament from the database
 * @param {number} id - The ID of the tournament to delete
 * @returns {Promise<Object|null>} Deleted tournament object if found, null otherwise
 */
export const deleteTournament = async (id) => {
  const result = await pool.query('DELETE FROM tournament WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

