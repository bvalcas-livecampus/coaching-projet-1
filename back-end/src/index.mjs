/**
 * Main application entry point
 * @module index
 */

import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import errorHandler from './middleware/error.mjs';
import charactersRoutes from './routes/characters.mjs';
import teamsRoutes from './routes/teams.mjs';
import _userRoutes from './routes/user.mjs';
import _tournamentRoutes from './routes/tournament.mjs';
import authentification from './middleware/authentification.mjs';
import { closePool } from './services/bdd.mjs';
import cors from 'cors';
import logger from './utils/logger.mjs';

dotenv.config();
const app = express();


if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined");
} else if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true // Allow credentials (cookies)
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      // secure: true, // Décommentez cette ligne si vous utilisez HTTPS
      httpOnly: true,
      maxAge: 600000 // Durée de vie de la session en millisecondes (ici, 10 minutes)
  }
}));

/**
 * Port number for the server
 * @type {number}
 */
const port = process.env.PORT || 3001;

//app.use("/", authRoutes);
app.use("/auth", authRoutes);
app.use("/characters", authentification, charactersRoutes);
app.use("/teams", authentification, teamsRoutes);
// app.use("/users", authentification, usersRoutes);
// app.use("/tournaments", authentification, tournamentsRoutes);

app.get('*', (req, res, next) => {
  logger.error(`Error at ${req.url}: ${res.message}`);
  next({ status: 404, message: 'Page non trouvée' });
});


app.use(errorHandler);

/**
 * Express server instance
 * @type {import('http').Server}
 */
const server = app.listen(port, () => {
  logger.info(`Serveur en cours d'exécution sur http://localhost:${port}`);
});


/**
 * Closes the server connection
 * @function closeServer
 * @returns {void}
 */
app.close = () => {
  console.log(`Server closing`);
  server.close();
  closePool();
};


export default app;
