/**
 * Database Configuration
 * Sequelize ORM connected to MySQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,        // max connections in pool
      min: 0,
      acquire: 30000, // max ms to get connection before throwing error
      idle: 10000     // ms a connection can be idle before release
    },
    define: {
      timestamps: true,       // createdAt + updatedAt on every table
      underscored: false,     // camelCase column names
    }
  }
);

module.exports = sequelize;
