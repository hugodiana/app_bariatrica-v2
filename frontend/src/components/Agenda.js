// frontend/src/components/Agenda.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Importando componentes do Material-UI
import {
    Box, Container, Grid, Paper, Typography, Button,
    TextField, List, ListItem, ListItemIcon, ListItemText, IconButton, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function Agenda({ handleNotification }) {
    const navigate = useNavigate();
    const [compromissos, setCompromissos] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        data_hora: '',
        local: '',
        descricao: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchCompromissos = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        setLoading(true); // Reinicia o loading a cada busca
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/compromissos/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCompromissos(data);
            } else {
                throw new Error('Falha ao carregar compromissos.');
            }
        } catch (err) {
            handleNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleNotification]);

    useEffect(() => {
        fetchCompromissos();
    }, [fetchCompromissos]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/compromissos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
                body: JSON.stringify(formData),
            });
            if (response.status === 201) {
                handleNotification('Compromisso agendado com sucesso!', 'success');
                setFormData({ titulo: '', data_hora: '', local: '', descricao: '' });
                fetchCompromissos(); // Atualiza a lista
            } else {
                const data = await response.json();
                handleNotification(Object.values(data).flat().join(' ') || 'Falha ao agendar compromisso.', 'error');
            }
        } catch (err) {
            handleNotification('Erro de rede.', 'error');
        }
    };

    const handleDelete = async (compromissoId) => {
        if (window.confirm('Tem certeza que deseja apagar este compromisso?')) {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/compromissos/${compromissoId}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${token}` }
                });
                if (response.status === 204) {
                    handleNotification('Compromisso apagado.', 'info');
                    fetchCompromissos();
                } else {
                    throw new Error('Falha ao apagar o compromisso.');
                }
            } catch (err) {
                handleNotification(err.message, 'error');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Minha Agenda</Typography>
            <Grid container spacing={3}>
                {/* Coluna do Formulário */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Agendar Novo Compromisso</Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField name="titulo" label="Título" value={formData.titulo} onChange={handleChange} fullWidth required margin="normal" />
                            <TextField name="data_hora" label="Data e Hora" type="datetime-local" value={formData.data_hora} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ shrink: true }} />
                            <TextField name="local" label="Local (Opcional)" value={formData.local} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="descricao" label="Descrição (Opcional)" value={formData.descricao} onChange={handleChange} fullWidth multiline rows={3} margin="normal" />
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Agendar</Button>
                        </Box>
                    </Paper>
                </Grid>
                {/* Coluna da Lista de Compromissos */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Próximos Compromissos</Typography>
                        <List>
                            {compromissos.length > 0 ? compromissos.map(comp => (
                                <ListItem
                                    key={comp.id}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(comp.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon>
                                        <EventAvailableIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={comp.titulo}
                                        secondary={`${new Date(comp.data_hora).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})} - Local: ${comp.local || 'Não informado'}`}
                                    />
                                </ListItem>
                            )) : (
                                <Typography variant="body2" color="text.secondary" sx={{p: 2}}>
                                    Nenhum compromisso agendado.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Agenda;