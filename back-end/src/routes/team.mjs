import express from 'express';
import { team as _teamService } from "../services/index.mjs"


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/:id', (req, res) => {
  res.send('Hello World!');
});


export default router;