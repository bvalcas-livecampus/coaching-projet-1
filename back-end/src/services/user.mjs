import pool from './bdd.mjs';

/**
 * Retrieves a user from the database by their ID
 * @param {number} id - The unique identifier of the user
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM user WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Creates a new user in the database
 * @param {Object} user - The user object to create
 * @param {string} user.name - The name of the user
 * @param {string} user.email - The email address of the user
 * @param {string} user.password - The password of the user
 * @returns {Promise<Object>} The created user object
 */
export const createUser = async (user) => {
  const result = await pool.query('INSERT INTO user (name, email, password) VALUES ($1, $2, $3)', [user.name, user.email, user.password]);
  return result.rows[0];
};

/**
 * Updates an existing user in the database
 * @param {number} id - The unique identifier of the user to update
 * @param {Object} user - The updated user object
 * @param {string} user.name - The new name of the user
 * @param {string} user.email - The new email address of the user
 * @param {string} user.password - The new password of the user
 * @returns {Promise<Object>} The updated user object
 */
export const updateUser = async (id, user) => {
  const result = await pool.query('UPDATE user SET name = $1, email = $2, password = $3 WHERE id = $4', [user.name, user.email, user.password, id]);
  return result.rows[0];
};

/**
 * Deletes a user from the database
 * @param {number} id - The unique identifier of the user to delete
 * @returns {Promise<Object|null>} The deleted user object if successful, null otherwise
 */
export const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM user WHERE id = $1', [id]);
  return result.rows[0];
};
