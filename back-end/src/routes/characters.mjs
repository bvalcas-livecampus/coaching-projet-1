import express from 'express';
import { characters as charactersService } from "../services/index.mjs"
import charactersMiddleware from "../middleware/characters.mjs"

const router = express.Router();

router.get('/', async (req, res) => {
    const characters = await charactersService.getCharacters();
    res.send(characters);
});

router.get('/:id', async (req, res, next) => {
    const character = await charactersService.getCharacterById(req.params.id);
    if (!character) {
        return next({ status: 404, message: 'Character not found' });
    }
    res.send(character);
});

router.post('/', async (req, res) => {
  const character = await charactersService.createCharacter(req.body, req.user.id);
  res.send(character);
});

router.put('/:id', charactersMiddleware, async (req, res, next) => {
  const character = req.characters.find(character => character.id === req.params.id);
  if (!character) {
    return next({ status: 404, message: 'Character not found' });
  }
  const updatedCharacter = await charactersService.updateCharacter({ ...character, ...req.body });
  res.send(updatedCharacter);
});

router.delete('/:id', charactersMiddleware, async (req, res, next) => {
  const character = req.characters.find(character => character.id === req.params.id);
  if (!character) {
    return next({ status: 404, message: 'Character not found' });
  }
  const deletedCharacter = await charactersService.deleteCharacter(character);
  res.send(deletedCharacter);
});

export default router;