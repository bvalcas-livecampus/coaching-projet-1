import pool from './bdd.mjs';
import logger from '../utils/logger.mjs';

/**
 * Retrieves a user from the database by their ID
 * @param {number} id - The unique identifier of the user
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const getUserById = async (id) => {
  try {
    logger.info(`Fetching user with ID: ${id}`);
    const result = await pool.query('SELECT * FROM user WHERE id = $1', [id]);
    if (!result.rows[0]) {
      logger.warn(`No user found with ID: ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}: ${error.message}`);
    throw error;
  }
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
  try {
    logger.info(`Creating new user with email: ${user.email}`);
    const result = await pool.query('INSERT INTO user (name, email, password) VALUES ($1, $2, $3)', [user.name, user.email, user.password]);
    logger.info(`Successfully created user with email: ${user.email}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
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
  try {
    logger.info(`Updating user with ID: ${id}`);
    const result = await pool.query('UPDATE user SET name = $1, email = $2, password = $3 WHERE id = $4', [user.name, user.email, user.password, id]);
    if (!result.rows[0]) {
      logger.warn(`No user found to update with ID: ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating user with ID ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes a user from the database
 * @param {number} id - The unique identifier of the user to delete
 * @returns {Promise<Object|null>} The deleted user object if successful, null otherwise
 */
export const deleteUser = async (id) => {
  try {
    logger.info(`Deleting user with ID: ${id}`);
    const result = await pool.query('DELETE FROM user WHERE id = $1', [id]);
    if (!result.rows[0]) {
      logger.warn(`No user found to delete with ID: ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}: ${error.message}`);
    throw error;
  }
};
