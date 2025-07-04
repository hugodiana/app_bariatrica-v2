// frontend/src/components/RequestPasswordReset.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography, CssBaseline } from '@mui/material';

function RequestPasswordReset({ handleNotification }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/password/reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                handleNotification('Se uma conta com este e-mail existir, um link de recuperação foi enviado.', 'success');
                navigate('/login');
            } else {
                // Mesmo que dê erro (ex: email não encontrado), mostramos uma mensagem genérica por segurança.
                handleNotification('Se uma conta com este e-mail existir, um link de recuperação foi enviado.', 'info');
                navigate('/login');
            }
        } catch (err) {
            handleNotification('Erro de rede. Não foi possível conectar ao servidor.', 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Recuperar Senha</Typography>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Digite seu e-mail e enviaremos um link para você definir uma nova senha.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Enviar Link de Recuperação
                    </Button>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Typography align="center" variant="body2">
                            Voltar para o Login
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default RequestPasswordReset;