import pool from './bdd.mjs';

export const getTournament = async () => {
  const result = await pool.query('SELECT * FROM tournament');
  return result.rows;
};

export const getTournamentById = async (id) => {
  const result = await pool.query('SELECT * FROM tournament WHERE id = $1', [id]);
  return result.rows[0];
};

export const createTournament = async (tournament) => {
  const result = await pool.query('INSERT INTO tournament (name) VALUES ($1) RETURNING *', [tournament.name]);
  return result.rows[0];
};

export const updateTournament = async (id, tournament) => {
  const result = await pool.query('UPDATE tournament SET name = $1 WHERE id = $2 RETURNING *', [tournament.name, id]);
  return result.rows[0];
};

export const deleteTournament = async (id) => {
  const result = await pool.query('DELETE FROM tournament WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

