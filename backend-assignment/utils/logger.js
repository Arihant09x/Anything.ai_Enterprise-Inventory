const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    // Use standard JSON format which is safe and production-ready
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

module.exports = logger;