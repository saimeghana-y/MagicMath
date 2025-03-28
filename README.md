# Magic Math Calculator

A full-stack application that calculates Magic Math numbers using a recursive formula:
- magic_math(0) = 0
- magic_math(1) = 1
- magic_math(N) = magic_math(N−1) + magic_math(N−2) + N

## Features

- RESTful API with Express.js
- React frontend with modern UI
- Memoization for efficient calculations
- Input validation
- Redis caching
- Rate limiting
- Docker support
- Swagger documentation
- Comprehensive test coverage
- Structured logging

## Project Structure

```
magic-math/
├── backend/           # Node.js Express backend
│   ├── src/
│   ├── tests/
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   └── Dockerfile
└── docker-compose.yml
```

## Prerequisites

- Node.js (v14 or higher)
- Redis
- Docker (optional)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   REDIS_URL=redis://localhost:6379
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Docker Setup

To run the entire application using Docker:

```bash
docker-compose up --build
```

## API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` for the Swagger documentation.

## Testing

Run tests for the backend:
```bash
cd backend
npm test
```

## License

MIT 