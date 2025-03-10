const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if we need to use socket authentication (no password)
const useSocketAuth = !process.env.DB_PASSWORD || process.env.DB_PASSWORD === '';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  useSocketAuth ? null : process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize; 