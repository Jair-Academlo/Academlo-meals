const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: './config.env' });

const db = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  logging: false,
});

module.exports = { db, DataTypes };
