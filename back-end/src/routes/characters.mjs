import express from 'express';
import { characters } from "../services"

const router = express.Router();

router.get('/', (req, res) => {
  
    res.send('Hello World!');
});

router.get('/:id', (req, res) => {
  res.send('Hello World!');
});


export default router;