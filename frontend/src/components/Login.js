// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline, Grid } from '@mui/material';

function Login({ handleNotification }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.key);
        handleNotification('Login bem-sucedido!', 'success');
        navigate('/painel');
      } else {
        handleNotification('Usuário ou senha inválidos.', 'error');
      }
    } catch (err) {
      handleNotification('Não foi possível conectar ao servidor.', 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="username" label="Nome de Usuário" name="username" autoComplete="username" autoFocus value={username} onChange={e => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link to="/recuperar-senha" style={{ textDecoration: 'none' }}><Typography variant="body2">Esqueceu a senha?</Typography></Link>
            </Grid>
            <Grid item>
              <Link to="/registro" style={{ textDecoration: 'none' }}><Typography variant="body2">Não tem uma conta?</Typography></Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
export default Login;