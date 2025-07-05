// frontend/src/components/Registration.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline, Grid } from '@mui/material';

function Registration({ handleNotification }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
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
      // CORREÇÃO AQUI
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password1: formData.password,
          password2: formData.password2,
        }),
      });
      if (response.status === 201) {
        handleNotification('Usuário registrado com sucesso! Por favor, faça o login.', 'success');
        navigate('/login');
      } else {
        const data = await response.json();
        const errorMsg = Object.values(data).flat().join(' ');
        handleNotification(errorMsg || 'Falha ao registrar.', 'error');
      }
    } catch (err) {
      handleNotification('Erro de rede. Tente novamente.', 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs"><CssBaseline /><Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Typography component="h1" variant="h5">Registrar Nova Conta</Typography><Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}><Grid container spacing={2}><Grid item xs={12}><TextField required fullWidth id="username" label="Nome de Usuário" name="username" autoComplete="username" onChange={handleChange} /></Grid><Grid item xs={12}><TextField required fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" onChange={handleChange} /></Grid><Grid item xs={12}><TextField required fullWidth name="password" label="Senha" type="password" id="password" onChange={handleChange} /></Grid><Grid item xs={12}><TextField required fullWidth name="password2" label="Confirmar Senha" type="password" id="password2" onChange={handleChange} /></Grid></Grid><Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrar</Button><Link to="/login" style={{ textDecoration: 'none' }}><Typography align="center" variant="body2">Já tem uma conta? Faça login</Typography></Link></Box></Box></Container>
  );
}
export default Registration;