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

async function testPostgres() {
  try {
    await sequelize.authenticate();
    console.log('Postgres Connected Successfully');
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', results.map((r: any) => r.table_name));
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Postgres Connection Error:', err);
    process.exit(1);
  }
}

testPostgres();
