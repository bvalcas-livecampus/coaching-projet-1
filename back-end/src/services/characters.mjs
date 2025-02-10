import pool from './bdd.mjs';

export const getCharacters = async () => {
  const result = await pool.query('SELECT * FROM characters');
  return result.rows;
};

export const getCharacterById = async (id) => {
  const result = await pool.query('SELECT * FROM characters WHERE id = $1', [id]);
  return result.rows[0];
};

export const getCharactersByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM characters WHERE player_id = $1', [userId]);
  return result.rows;
};

export const createCharacter = async (character, userId) => {

  const result = await pool.query('INSERT INTO characters (name, role_id, class_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5) RETURNING *', [character.name, character.role_id, character.class_id, character.ilvl, character.rio]);
  await pool.query('INSERT INTO belong_to (character_id, player_id) VALUES ($1, $2)', [result.rows[0].id, userId]);
  return result.rows[0];
};

export const updateCharacter = async (character) => {
  const result = await pool.query('UPDATE characters SET name = $1 WHERE id = $2 RETURNING *', [character.name, character.id]);
  return result.rows[0];
};

export const deleteCharacter = async (character) => {
  const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING *', [character.id]);
  return result.rows[0];
};


