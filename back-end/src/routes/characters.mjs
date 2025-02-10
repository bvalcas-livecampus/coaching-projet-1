import express from 'express';
import { characters as charactersService } from "../services/index.mjs"
import charactersMiddleware from "../middleware/characters.mjs"
import logger from '../utils/logger.mjs';

const router = express.Router();

/**
 * @route GET /characters
 * @description Get all characters
 * @returns {Promise<Array>} Array of character objects
 */
router.get('/', async (req, res, next) => {
    try {
        logger.info('Fetching all characters');
        const characters = await charactersService.getCharacters();
        logger.info(`Retrieved ${characters.length} characters`);
        return res.send(characters);
    } catch (error) {
        logger.error('Error fetching characters:', error);
        return next(error);
    }
});

/**
 * @route GET /characters/:id
 * @description Get a character by ID
 * @param {string} req.params.id - Character ID
 * @returns {Promise<Object>} Character object
 * @throws {Object} 404 - Character not found
 */
router.get('/:id', async (req, res, next) => {
    try {
        logger.info(`Fetching character with id: ${req.params.id}`);
        const character = await charactersService.getCharacterById(req.params.id);
        if (!character) {
            logger.warn(`Character not found with id: ${req.params.id}`);
            return next({ status: 404, message: 'Character not found' });
        }
        logger.info(`Retrieved character: ${character.name}`);
        return res.send(character);
    } catch (error) {
        logger.error(`Error fetching character ${req.params.id}:`, error);
        return next(error);
    }
});

/**
 * @route POST /characters
 * @description Create a new character
 * @param {Object} req.body - Character data
 * @param {string} req.user.id - User ID of the creator
 * @returns {Promise<Object>} Created character object
 */
router.post('/', async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.role_id || !req.body.class_id || !req.body.ilvl || !req.body.rio || !req.user || !req.user.id) {
            logger.warn('Attempted to create character with missing fields', { body: req.body });
            return res.status(400).send({ message: 'Missing required fields' });
        }
        logger.info(`Creating new character: ${req.body.name}`, { userId: req.user.id });
        const character = await charactersService.createCharacter(req.body, req.user.id);
        logger.info(`Created character: ${character.name}`, { characterId: character.id });
        return res.send(character);
    } catch (error) {
        logger.error('Error creating character:', error);
        return next(error);
    }
});


/**
 * @route PUT /characters/:id
 * @description Update a character by ID
 * @param {string} req.params.id - Character ID
 * @param {Object} req.body - Updated character data
 * @returns {Promise<Object>} Updated character object
 * @throws {Object} 404 - Character not found
 */
router.put('/:id', charactersMiddleware, async (req, res, next) => {
    try {
        logger.info(`Attempting to update character: ${req.params.id}`, { updates: req.body });
        if (!req.body.name) {
            logger.warn('Attempted to update character with missing name field');
            return res.status(400).send({ message: 'Missing required fields' });
        }
        const character = req.characters.find(character => character.id === req.params.id);
        if (!character) {
            logger.warn(`Character not found for update with id: ${req.params.id}`);
            return next({ status: 404, message: 'Character not found' });
        }
        const updatedCharacter = await charactersService.updateCharacter({ ...character, ...req.body });
        logger.info(`Updated character: ${updatedCharacter.name}`, { characterId: updatedCharacter.id });
        return res.send(updatedCharacter);
    } catch (error) {
        logger.error(`Error updating character ${req.params.id}:`, error);
        return next(error);
    }
});

/**
 * @route DELETE /characters/:id
 * @description Delete a character by ID
 * @param {string} req.params.id - Character ID
 * @returns {Promise<Object>} Deleted character object
 * @throws {Object} 404 - Character not found
 */
router.delete('/:id', charactersMiddleware, async (req, res, next) => {
    try {
        logger.info(`Attempting to delete character: ${req.params.id}`);
        const character = req.characters.find(character => character.id === req.params.id);
        if (!character) {
            logger.warn(`Character not found for deletion with id: ${req.params.id}`);
            return next({ status: 404, message: 'Character not found' });
        }
        const deletedCharacter = await charactersService.deleteCharacter(character);
        logger.info(`Deleted character: ${deletedCharacter.name}`, { characterId: deletedCharacter.id });
        return res.send(deletedCharacter);
    } catch (error) {
        logger.error(`Error deleting character ${req.params.id}:`, error);
        return next(error);
    }
});

export default router;