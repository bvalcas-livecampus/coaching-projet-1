import pool from './bdd.mjs';

/**
 * Creates a new composition entry linking a character to a team
 * @param {Object} team - The team object containing an id property
 * @param {Object} character - The character object containing an id property
 * @returns {Promise<Object>} The newly created compose entry
 */
export const compose = async (team, character) => {
  const result = await pool.query('INSERT INTO compose (party_id, character_id) VALUES ($1, $2) RETURNING *', [team.id, character.id]);
  return result.rows[0];
};

/**
 * Deletes all composition entries for a specific team
 * @param {Object} team - The team object containing an id property
 * @returns {Promise<Object>} The deleted compose entry
 */
export const deleteCompose = async (team) => {
  const result = await pool.query('DELETE FROM compose WHERE party_id = $1 RETURNING *', [team.id]);
  return result.rows[0];
};




