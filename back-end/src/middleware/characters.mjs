import { characters as charactersService } from "../services/index.mjs";
import logger from '../utils/logger.mjs';

/**
 * Middleware to fetch characters associated with the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Calls next() with error if no characters found, or with characters attached to req
 */
const getCharacters = async (req, res, next) => {
  logger.info('Starting getCharacters middleware');
  
  if (!req.user || !req.user.id) {
    logger.warn('No user id found in request');
    return next({ status: 400, message: 'No user id found' });
  }

  try {
    logger.info(`Fetching characters for user ${req.user.id}`);
    const characters = await charactersService.getCharactersByUserId(req.user.id);
    
    if (characters.length === 0) {
      logger.warn(`No characters found for user ${req.user.id}`);
      return next({ status: 400, message: 'No characters found' });
    }

    logger.info(`Found ${characters.length} characters for user ${req.user.id}`);
    req.characters = characters;
    next();
  } catch (error) {
    logger.error(`Error fetching characters: ${error.message}`);
    next(error);
  }
};

export default getCharacters;
