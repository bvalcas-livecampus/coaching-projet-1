import express from 'express';
import { characters as charactersService } from "../services/index.mjs"
import charactersMiddleware from "../middleware/characters.mjs"

const router = express.Router();

/**
 * @route GET /characters
 * @description Get all characters
 * @returns {Promise<Array>} Array of character objects
 */
router.get('/', async (req, res) => {
    const characters = await charactersService.getCharacters();
    return res.send(characters);
});

/**
 * @route GET /characters/:id
 * @description Get a character by ID
 * @param {string} req.params.id - Character ID
 * @returns {Promise<Object>} Character object
 * @throws {Object} 404 - Character not found
 */
router.get('/:id', async (req, res, next) => {
    const character = await charactersService.getCharacterById(req.params.id);
    if (!character) {
        return next({ status: 404, message: 'Character not found' });
    }
    return res.send(character);
});

/**
 * @route POST /characters
 * @description Create a new character
 * @param {Object} req.body - Character data
 * @param {string} req.user.id - User ID of the creator
 * @returns {Promise<Object>} Created character object
 */
router.post('/', async (req, res) => {
  const character = await charactersService.createCharacter(req.body, req.user.id);
  return res.send(character);
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
  const character = req.characters.find(character => character.id === req.params.id);
  if (!character) {
    return next({ status: 404, message: 'Character not found' });
  }
  const updatedCharacter = await charactersService.updateCharacter({ ...character, ...req.body });
  return res.send(updatedCharacter);
});

/**
 * @route DELETE /characters/:id
 * @description Delete a character by ID
 * @param {string} req.params.id - Character ID
 * @returns {Promise<Object>} Deleted character object
 * @throws {Object} 404 - Character not found
 */
router.delete('/:id', charactersMiddleware, async (req, res, next) => {
  const character = req.characters.find(character => character.id === req.params.id);
  if (!character) {
    return next({ status: 404, message: 'Character not found' });
  }
  const deletedCharacter = await charactersService.deleteCharacter(character);
  return res.send(deletedCharacter);
});

export default router;