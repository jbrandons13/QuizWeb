import express from 'express';
import { RoomControllerAttributes } from '../dto/room.dto';
import { Socket } from 'socket.io';
import GameRepository from '../repository/game.repos';
import { Token } from '../../module/dto.module';
import jwt from 'jsonwebtoken';
const router = express.Router();


router.post('/', async (req, res) => {

  try {
    const { gamecode } = req.body as RoomControllerAttributes;
    const game = await GameRepository.getGameIdByGameCode(gamecode);
    res.status(200).json(game);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
