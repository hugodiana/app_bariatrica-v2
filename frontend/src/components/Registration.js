// frontend/src/components/Registration.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline, Grid } from '@mui/material';

function Registration({ handleNotification }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      handleNotification('As senhas não coincidem.', 'error');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          // Usamos o email como um username único para o Django
          username: formData.email,
          password: formData.password,
          password2: formData.password2,
        }),
      });
      if (response.status === 201) {
        handleNotification('Usuário registrado com sucesso! Por favor, faça o login.', 'success');
        navigate('/login');
      } else {
        const data = await response.json();
        const errorMsg = Object.values(data).flat().join(' ');
        handleNotification(errorMsg || 'Falha ao registrar. Verifique os dados.', 'error');
      }
    } catch (err) {
      handleNotification('Erro de rede. Tente novamente.', 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Registrar Nova Conta</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Campos atualizados para Nome e Sobrenome */}
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="firstName" label="Nome" name="firstName" autoComplete="given-name" onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="lastName" label="Sobrenome" name="lastName" autoComplete="family-name" onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="password" label="Senha" type="password" id="password" onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="password2" label="Confirmar Senha" type="password" id="password2" onChange={handleChange} />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrar</Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">Já tem uma conta? Faça login</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Registration;