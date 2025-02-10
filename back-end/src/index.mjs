/**
 * Main application entry point
 * @module index
 */

import express from 'express';
import dotenv from 'dotenv';
import _authRoutes from './routes/auth.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import errorHandler from './middleware/error.mjs';
import charactersRoutes from './routes/characters.mjs';
import teamsRoutes from './routes/teams.mjs';
import _userRoutes from './routes/user.mjs';
import _tournamentRoutes from './routes/tournament.mjs';
import authentification from './middleware/authentification.mjs';

dotenv.config();
const app = express();

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined");
} else if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

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
app.use("/characters", authentification, charactersRoutes);
app.use("/teams", authentification, teamsRoutes);
// app.use("/users", authentification, usersRoutes);
// app.use("/tournaments", authentification, tournamentsRoutes);

app.get('*', (_req, _res, next) => {
  next({ status: 404, message: 'Page non trouvée' });
});

app.use(errorHandler);

/**
 * Express server instance
 * @type {import('http').Server}
 */
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}).on('error', (error) => {
  console.log(`Error starting server on port: ${port} -`, error.message);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});


/**
 * Closes the server connection
 * @function closeServer
 * @returns {void}
 */
export const closeServer = () => {
  if (server) {
    console.log(`Server closed`);
    server.close();
  }
};

export default app;
