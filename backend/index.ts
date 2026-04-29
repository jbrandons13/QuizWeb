import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import syncAllModels from './src/db/sync';
import creator from './src/controller/creator.controller';
import game from './src/controller/game.controller';
import question from './src/controller/question.controller';
import record from './src/controller/record.controller';
import room from './src/controller/room.controller';
import timer from './src/controller/timer.controller'
import cookieParser from 'cookie-parser';

import {createServer} from "http";
import { Server, Socket } from 'socket.io';
import waitingRoomSocket from './src/socket/waitingroom.socket';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CORS_ORIGIN_NGROK,
  process.env.CORS_ORIGIN_1,
  process.env.CORS_ORIGIN_2
].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  methods: ['GET', 'POST','DELETE','PUT'],
};

app.use(cors(corsOptions));
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, { cors: corsOptions });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Project';

mongoose.connect(MONGODB_URI);
const conn = mongoose.connection;
conn.once('open', ()=> {
  console.log("mongo success")
});
conn.on('error', (error) => {
  console.error("MongoDB connection error:", error);
});

io.on('connection', waitingRoomSocket(io));

app.use('/creator', creator);
app.use('/game', game);
app.use('/question', question);
app.use('/record', record);
app.use('/room', room);
app.use('/timer', timer);

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    syncAllModels(); 
    httpServer.listen(PORT, () => { 
      console.log(`Server started on port ${PORT}`);
    });   
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();