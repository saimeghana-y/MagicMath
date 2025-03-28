# Magic Math Calculator

A full-stack application that calculates Magic Math numbers using a recursive formula:
- magic_math(0) = 0
- magic_math(1) = 1
- magic_math(N) = magic_math(N−1) + magic_math(N−2) + N

## Implementation Details

### Backend (Node.js + Express)
- **RESTful API**: Endpoint for Magic Math calculations at `/api/magic-math/:n`
- **Redis Caching**: Improved performance by caching calculated results
- **Rate Limiting**: Protection against API abuse using express-rate-limit
- **Input Validation**: Robust validation using express-validator
- **API Documentation**: Swagger/OpenAPI documentation available at `/api-docs`
- **Structured Logging**: Using Winston for better debugging and monitoring
- **Unit Tests**: Comprehensive test coverage with Jest
- **Memoization**: Efficient calculation using in-memory caching

### Frontend (React)
- **Modern UI**: Clean, responsive design using Material-UI components
- **Real-time Validation**: Immediate feedback on input errors
- **Loading States**: Visual feedback during calculations
- **Error Handling**: Clear error messages for failed requests
- **React Query**: Efficient data fetching and cache management
- **Responsive Design**: Works seamlessly on all screen sizes
- **Clear Documentation**: In-app explanation of the Magic Math formula

### DevOps
- **Docker Support**: Containerized services for consistent environments
- **Docker Compose**: Easy deployment of all services
- **Redis Persistence**: Volume mounting for data persistence
- **Environment Configuration**: Flexible configuration through environment variables

## Algorithm Implementation

### Current Implementation (Recursive with Memoization)
```javascript
// Memoization cache
const memo = new Map();

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
```

### Optimized Implementation (Iterative)
```javascript
function calculateMagicMath(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;

  let prev2 = 0;  // f(n-2)
  let prev1 = 1;  // f(n-1)
  let current = 0;

  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2 + i;
    prev2 = prev1;
    prev1 = current;
  }

  return current;
}
```

### Algorithm Complexity
- Time Complexity: O(n)
- Space Complexity: O(1) for iterative, O(n) for recursive with memoization
- Cache Complexity: Additional O(n) space for Redis caching

## Project Structure

```
magic-math/
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── index.js  # Main server file
│   │   └── __tests__/# Test files
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   │   ├── App.js   # Main React component
│   │   └── index.js # React entry point
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

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` for the Swagger documentation.

### Example API Call
```bash
curl http://localhost:5000/api/magic-math/5
```

## Testing

Run tests for the backend:
```bash
cd backend
npm test
```

## License

MIT 
