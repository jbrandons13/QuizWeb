import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'finalproject',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'localhost',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
});

async function checkData() {
  try {
    const [creators] = await sequelize.query('SELECT count(*) FROM "Creator"');
    console.log('Total Creators:', creators);
    
    const [games] = await sequelize.query('SELECT count(*) FROM "Game"');
    console.log('Total Games:', games);

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Data Check Error:', err);
    process.exit(1);
  }
}

checkData();
