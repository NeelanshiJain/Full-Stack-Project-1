import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Box, Button, TextField } from '@mui/material';

const LOGIN = gql`
mutation Login($email:String!,$password:String!){
    login(email:$email,password:$password)
  }
`;
interface LoginProps {
  onError: (error: Error) => void;
}

const Login: React.FC<LoginProps> = ({ onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation<{ login: string }, { email: string; password: string }>(LOGIN);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      if (data) {
        localStorage.setItem('token', data.login);
        alert('User authenticated successfully');
      }
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto' }}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};
export default Login;
