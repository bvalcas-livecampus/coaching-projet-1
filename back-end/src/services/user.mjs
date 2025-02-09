import pool from './bdd.mjs';

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM user WHERE id = $1', [id]);
  return result.rows[0];
};

export const createUser = async (user) => {
  const result = await pool.query('INSERT INTO user (name, email, password) VALUES ($1, $2, $3)', [user.name, user.email, user.password]);
  return result.rows[0];
};

export const updateUser = async (id, user) => {
  const result = await pool.query('UPDATE user SET name = $1, email = $2, password = $3 WHERE id = $4', [user.name, user.email, user.password, id]);
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM user WHERE id = $1', [id]);
  return result.rows[0];
};
