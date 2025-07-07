// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline, Grid } from '@mui/material';

function Login({ handleNotification }) {
  const navigate = useNavigate();
  // 1. Mudamos o estado de 'username' para 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Enviamos 'email' em vez de 'username' para a API
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.key);
        handleNotification('Login bem-sucedido!', 'success');
        navigate('/painel');
      } else {
        handleNotification('Email ou senha inválidos.', 'error');
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
          {/* 3. O campo de texto agora pede o Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
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