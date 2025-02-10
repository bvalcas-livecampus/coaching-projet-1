/**
 * Database connection configuration module.
 * @module services/bdd
 */

import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

/**
 * Load environment variables from .env file
 */
dotenv.config();

if (!process.env.BDD_HOST) {
  throw new Error("BDD_HOST is not defined");
} else if (!process.env.BDD_PORT) {
  throw new Error("BDD_PORT is not defined");
} else if (!process.env.BDD_USER) {
  throw new Error("BDD_USER is not defined");
} else if (!process.env.BDD_PASSWORD) {
  throw new Error("BDD_PASSWORD is not defined");
} else if (!process.env.BDD_NAME) {
  throw new Error("BDD_NAME is not defined");
}

/**
 * PostgreSQL connection pool instance.
 * Configured using environment variables:
 * - BDD_HOST: Database host address
 * - BDD_PORT: Database port number
 * - BDD_USER: Database user name
 * - BDD_PASSWORD: Database password
 * - BDD_NAME: Database name
 * @type {pg.Pool}
 */
const pool = new Pool({
  host: process.env.BDD_HOST,
  port: process.env.BDD_PORT,
  user: process.env.BDD_USER,
  password: process.env.BDD_PASSWORD,
  database: process.env.BDD_NAME
});

/**
 * Closes the database connection pool.
 * @exports closePool
 */
export const closePool = async () => {
  await pool.end();
};

/**
 * Exports the configured database connection pool.

 * @exports pool
 */
export default pool;
