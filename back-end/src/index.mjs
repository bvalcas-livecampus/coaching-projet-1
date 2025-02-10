import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import errorHandler from './middleware/error.mjs';
import charactersRoutes from './routes/characters.mjs';
import teamsRoutes from './routes/teams.mjs';
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

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export const closeServer = () => {
  server.close();
};
