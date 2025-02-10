import pool from './bdd.mjs';

export const getCharacterById = async (id) => {
  const result = await pool.query('SELECT * FROM characters WHERE id = $1', [id]);
  return result.rows[0];
};

export const createCharacter = async (character) => {
  const result = await pool.query('INSERT INTO characters (name) VALUES ($1) RETURNING *', [character.name]);
  return result.rows[0];
};

export const updateCharacter = async (id, character) => {
  const result = await pool.query('UPDATE characters SET name = $1 WHERE id = $2 RETURNING *', [character.name, id]);
  return result.rows[0];
};

export const deleteCharacter = async (id) => {
  const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};


