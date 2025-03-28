require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const Redis = require('redis');
const { param, validationResult } = require('express-validator');
const winston = require('winston');

// Initialize Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Magic Math API',
      version: '1.0.0',
      description: 'API for calculating Magic Math numbers',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Memoization cache
const memo = new Map();

/**
 * @swagger
 * /api/magic-math/{n}:
 *   get:
 *     summary: Calculate Magic Math number for given input
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *         description: Input number for Magic Math calculation
 *     responses:
 *       200:
 *         description: Successfully calculated Magic Math number
 *       400:
 *         description: Invalid input
 */
app.get('/api/magic-math/:n',
  param('n').isInt({ min: 0 }).withMessage('Input must be a non-negative integer'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const n = parseInt(req.params.n);
      
      // Check Redis cache first
      const cachedResult = await redisClient.get(`magic-math:${n}`);
      if (cachedResult) {
        logger.info(`Cache hit for n=${n}`);
        return res.json({ result: parseInt(cachedResult) });
      }

      // Calculate using memoization
      const result = calculateMagicMath(n);
      
      // Cache the result in Redis
      await redisClient.set(`magic-math:${n}`, result.toString());
      
      logger.info(`Calculated magic-math(${n}) = ${result}`);
      res.json({ result });
    } catch (error) {
      logger.error(`Error calculating magic-math: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

function calculateMagicMath(n) {
  // Base cases
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Check memoization cache
  if (memo.has(n)) {
    return memo.get(n);
  }

  // Calculate recursively with memoization
  const result = calculateMagicMath(n - 1) + calculateMagicMath(n - 2) + n;
  memo.set(n, result);
  return result;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Connect to Redis and start server
redisClient.connect().then(() => {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
  });
}).catch(err => {
  logger.error(`Redis connection error: ${err.message}`);
  process.exit(1);
}); 