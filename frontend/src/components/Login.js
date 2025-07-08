// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Importando componentes do Material-UI
import { 
    Button, TextField, Container, Box, Typography, CssBaseline, Grid, 
    InputAdornment, IconButton 
} from '@mui/material';
// Importando Ícones
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


function Login({ handleNotification }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Esta linha agora funcionará corretamente após criar o arquivo .env e reiniciar o servidor
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        
        <HealthAndSafetyIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom>BariPlus</Typography>
        <Typography component="h2" variant="h6">Login</Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          
          {/* CORREÇÃO DA SINTAXE DO GRID AQUI */}
          <Grid container justifyContent="space-between">
            <Grid>
              <Link to="/recuperar-senha" style={{ textDecoration: 'none' }}><Typography variant="body2">Esqueceu a senha?</Typography></Link>
            </Grid>
            <Grid>
              <Link to="/registro" style={{ textDecoration: 'none' }}><Typography variant="body2">Não tem uma conta?</Typography></Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;