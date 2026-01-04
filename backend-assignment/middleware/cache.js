const Redis = require('ioredis');
const logger = require('../utils/logger');

// Connect to Upstash Redis using the URL from .env
const redis = new Redis(process.env.REDIS_URL);

const cache = (duration) => async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    // Create a unique key for this URL
    const key = `__express__${req.originalUrl || req.url}`;

    try {
        const cachedResponse = await redis.get(key);

        if (cachedResponse) {
            // If found in Redis, return it immediately
            logger.info(`⚡ Cache Hit for ${key}`);
            return res.status(200).json(JSON.parse(cachedResponse));
        } else {
            // If not found, hijack the res.json method to save the data before sending
            res.originalSend = res.json;
            res.json = (body) => {
                redis.set(key, JSON.stringify(body), 'EX', duration);
                res.originalSend(body);
            };
            next();
        }
    } catch (err) {
        logger.error('Redis Cache Error: ' + err.message);
        next(); // If Redis fails, just continue to DB
    }
};

module.exports = cache;