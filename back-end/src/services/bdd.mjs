import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.BDD_HOST,
  port: process.env.BDD_PORT,
  user: process.env.BDD_USER,
  password: process.env.BDD_PASSWORD,
  database: process.env.BDD_NAME
});

export default pool;
