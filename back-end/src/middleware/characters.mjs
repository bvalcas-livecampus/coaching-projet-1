import { characters as charactersService } from "../services/index.mjs";

const getCharacters = async (req, res, next) => {
  const characters = await charactersService.getCharactersByUserId(req.user.id);
  req.characters = characters;
  next();
};

export default getCharacters;
