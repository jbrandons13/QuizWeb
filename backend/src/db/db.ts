import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'finalproject',
  username: 'postgres',
  password: 'localhost',
  host: 'localhost', // Change this to your database host
  port: 5432, // Change this to your database port
  dialect: 'postgres',
});

export default sequelize;
