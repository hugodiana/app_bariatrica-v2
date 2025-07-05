// frontend/src/components/ConfirmPasswordReset.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline, Grid } from '@mui/material';

function ConfirmPasswordReset({ handleNotification }) {
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const [formData, setFormData] = useState({ new_password1: '', new_password2: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.new_password1 !== formData.new_password2) {
            handleNotification('As novas senhas não coincidem.', 'error');
            return;
        }
        try {
            // CORREÇÃO AQUI
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/password/reset/confirm/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, token, new_password1: formData.new_password1, new_password2: formData.new_password2 }),
            });
            if (response.ok) {
                handleNotification('Sua senha foi redefinida com sucesso! Por favor, faça o login.', 'success');
                navigate('/login');
            } else {
                const data = await response.json();
                handleNotification(Object.values(data).flat().join(' ') || 'Falha ao redefinir a senha.', 'error');
            }
        } catch (err) {
            handleNotification('Erro de rede.', 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs"><CssBaseline /><Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Typography component="h1" variant="h5">Definir Nova Senha</Typography><Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}><Grid container spacing={2}><Grid item xs={12}><TextField required fullWidth name="new_password1" label="Nova Senha" type="password" id="new_password1" onChange={handleChange} /></Grid><Grid item xs={12}><TextField required fullWidth name="new_password2" label="Confirmar Nova Senha" type="password" id="new_password2" onChange={handleChange} /></Grid></Grid><Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Salvar Nova Senha</Button></Box></Box></Container>
    );
}
export default ConfirmPasswordReset;