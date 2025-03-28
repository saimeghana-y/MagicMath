import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

const queryClient = new QueryClient();

function MagicMathCalculator() {
  const [input, setInput] = useState('');
  const [submittedValue, setSubmittedValue] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['magicMath', submittedValue],
    async () => {
      if (!submittedValue) return null;
      const response = await axios.get(`http://localhost:5000/api/magic-math/${submittedValue}`);
      return response.data;
    },
    {
      enabled: !!submittedValue,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(input);
    if (!isNaN(num) && num >= 0) {
      setSubmittedValue(num);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Magic Math Calculator
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter a number"
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              error={input !== '' && (isNaN(parseInt(input)) || parseInt(input) < 0)}
              helperText={input !== '' && (isNaN(parseInt(input)) || parseInt(input) < 0) ? "Please enter a non-negative integer" : ""}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading || input === '' || isNaN(parseInt(input)) || parseInt(input) < 0}
            >
              Calculate
            </Button>
          </form>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error: {error.message}
            </Alert>
          )}

          {data && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Result:
              </Typography>
              <Typography variant="h4" color="primary">
                {data.result}
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            About Magic Math
          </Typography>
          <Typography variant="body1" paragraph>
            Magic Math is defined as follows:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 2 }}>
            <ul>
              <li>magic_math(0) = 0</li>
              <li>magic_math(1) = 1</li>
              <li>magic_math(N) = magic_math(N−1) + magic_math(N−2) + N</li>
            </ul>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MagicMathCalculator />
    </QueryClientProvider>
  );
}

export default App; 