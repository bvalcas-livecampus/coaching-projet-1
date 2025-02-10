import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

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

const pool = new Pool({
  host: process.env.BDD_HOST,
  port: process.env.BDD_PORT,
  user: process.env.BDD_USER,
  password: process.env.BDD_PASSWORD,
  database: process.env.BDD_NAME
});

export default pool;
