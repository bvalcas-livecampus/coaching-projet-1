import express from 'express';
import { tournament as _tournamentService } from "../services/index.mjs"

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello World!');
});

router.get('/:id', (req, res) => {
  res.send('Hello World!');
});


export default router;