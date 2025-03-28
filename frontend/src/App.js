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
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

const queryClient = new QueryClient();

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  width: '100%',
  maxWidth: '400px',
  background: '#ffffff',
  minHeight: '450px',
  display: 'flex',
  flexDirection: 'column'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    '&:hover': {
      backgroundColor: '#f0f1f2',
    },
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '12px',
  fontSize: '1rem',
  textTransform: 'none',
  backgroundColor: '#9c27b0',
  '&:hover': {
    backgroundColor: '#7b1fa2',
  },
}));

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
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f0ff',
      py: 4,
    }}>
      <StyledPaper elevation={0}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: '#9c27b0',
            fontWeight: 500,
            marginBottom: 4
          }}
        >
          Magic Math
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <StyledTextField
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
          
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || input === '' || isNaN(parseInt(input)) || parseInt(input) < 0}
          >
            Calculate
          </StyledButton>
        </form>

        {/* Add a container with fixed height for result/loading */}
        <Box sx={{ 
          height: '120px',  // Fixed height to prevent layout shifts
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3
        }}>
          {isLoading ? (
            <CircularProgress sx={{ color: '#9c27b0' }} />
          ) : data ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
                Result
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#9c27b0',
                  fontWeight: 500
                }}
              >
                {data.result}
              </Typography>
            </Box>
          ) : null}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: '10px' }}>
            Error: {error.message}
          </Alert>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#9c27b0', fontSize: '1.1rem' }}>
            About Magic Math
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            Magic Math is defined as follows:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, color: '#666' }}>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              <li>magic_math(0) = 0</li>
              <li>magic_math(1) = 1</li>
              <li>magic_math(N) = magic_math(N−1) + magic_math(N−2) + N</li>
            </ul>
          </Typography>
        </Box>
      </StyledPaper>
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