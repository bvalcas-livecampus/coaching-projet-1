import pool from './bdd.mjs';

export const getTeamById = async (id) => {
  const result = await pool.query('SELECT * FROM team WHERE id = $1', [id]);
  return result.rows[0];
};

export const createTeam = async (team) => {
  const result = await pool.query('INSERT INTO team (name) VALUES ($1) RETURNING *', [team.name]);
  return result.rows[0];
};

export const updateTeam = async (id, team) => {
  const result = await pool.query('UPDATE team SET name = $1 WHERE id = $2 RETURNING *', [team.name, id]);
  return result.rows[0];
};

export const deleteTeam = async (id) => {
  const result = await pool.query('DELETE FROM team WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
