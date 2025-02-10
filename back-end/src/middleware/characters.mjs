import { characters as charactersService } from "../services/index.mjs";

/**
 * Middleware to fetch characters associated with the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Calls next() with error if no characters found, or with characters attached to req
 */
const getCharacters = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next({ status: 400, message: 'No user id found' });
  }
  const characters = await charactersService.getCharactersByUserId(req.user.id);
  if (characters.length === 0) {

    return next({ status: 400, message: 'No characters found' });
  }
  req.characters = characters;
  next();
};

export default getCharacters;
