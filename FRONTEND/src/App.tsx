import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './main';
import Login from './components/Login'
import ErrorSnackbar from './ErrorSnackbar';

const App: React.FC = () => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginError = (error: Error) => {
    setErrorMessage(error.message || 'An error occurred');
    setIsSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Login</h1>
        <Login onError={handleLoginError} />
        <ErrorSnackbar open={isSnackbarOpen} message={errorMessage} onClose={handleSnackbarClose} />
      </div>
    </ApolloProvider>
  );
};

export default App;

