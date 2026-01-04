const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database Connected Successfully.');
        // This updates the database tables if you change code
        await sequelize.sync({ alter: true });
        logger.info('Database Models Synced.');
    } catch (err) {
        logger.error('Database Connection Failed: ' + err.message);
        // We don't exit process here to allow server to keep trying or stay up
    }
};

module.exports = { sequelize, connectDB };