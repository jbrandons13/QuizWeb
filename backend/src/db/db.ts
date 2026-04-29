import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'finalproject',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'localhost',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
});

export default sequelize;

