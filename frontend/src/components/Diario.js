// frontend/src/components/Diario.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// A CORREÇÃO ESTÁ AQUI: Adicionamos ListItemIcon à lista de imports
import {
    Box, Container, Paper, Typography, Button,
    TextField, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';

function Diario({ handleNotification }) {
    const navigate = useNavigate();
    const [entradas, setEntradas] = useState([]);
    const [textoEntrada, setTextoEntrada] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchEntradas = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/entradas-diario/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEntradas(data);
            } else {
                throw new Error('Falha ao carregar entradas do diário.');
            }
        } catch (err) {
            handleNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleNotification]);

    useEffect(() => {
        fetchEntradas();
    }, [fetchEntradas]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!textoEntrada.trim()) {
            handleNotification('A entrada do diário não pode estar vazia.', 'warning');
            return;
        }
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/entradas-diario/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
                body: JSON.stringify({ texto: textoEntrada }),
            });
            if (response.status === 201) {
                handleNotification('Entrada do diário salva com sucesso!', 'success');
                setTextoEntrada('');
                fetchEntradas();
            } else {
                const data = await response.json();
                handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar entrada.', 'error');
            }
        } catch (err) {
            handleNotification('Erro de rede.', 'error');
        }
    };
    
    const handleDelete = async (entradaId) => {
        if (window.confirm('Tem certeza que deseja apagar esta entrada do diário?')) {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/entradas-diario/${entradaId}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${token}` }
                });
                if (response.status === 204) {
                    handleNotification('Entrada apagada.', 'info');
                    fetchEntradas();
                } else {
                    throw new Error('Falha ao apagar a entrada.');
                }
            } catch (err) {
                handleNotification(err.message, 'error');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Meu Diário</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Como você está se sentindo hoje?</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Escreva sobre seu dia, sentimentos, desafios..."
                        multiline
                        rows={6}
                        fullWidth
                        value={textoEntrada}
                        onChange={(e) => setTextoEntrada(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Salvar Entrada de Hoje
                    </Button>
                </Box>
            </Paper>
            <Divider />
            <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Entradas Anteriores</Typography>
            <List>
                {entradas.length > 0 ? entradas.map(entrada => (
                    <Paper key={entrada.id} sx={{ mb: 2 }}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(entrada.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemIcon sx={{mr: 2, alignSelf: 'flex-start', mt: 1}}>
                                <BookIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={<strong>{new Date(entrada.data + 'T00:00:00-03:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>}
                                secondary={
                                    <Typography component="p" variant="body2" style={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                        {entrada.texto}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Paper>
                )) : (
                    <Typography variant="body2" color="text.secondary">Nenhuma entrada no diário ainda.</Typography>
                )}
            </List>
        </Container>
    );
}

export default Diario;