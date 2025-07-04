// frontend/src/components/EditarRegistro.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CssBaseline, Box, Container, Paper, Typography, Button, TextField, Checkbox, FormControlLabel, Grid } from '@mui/material';

function EditarRegistro({ handleNotification }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        peso: '',
        agua_ml: '',
        vitaminas_tomadas: false,
        observacoes: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }

        const fetchRegistro = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/acompanhamento/registros/${id}/`, { headers: { 'Authorization': `Token ${token}` } });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        peso: data.peso || '',
                        agua_ml: data.agua_ml || '',
                        vitaminas_tomadas: data.vitaminas_tomadas || false,
                        observacoes: data.observacoes || ''
                    });
                } else { throw new Error('Falha ao carregar o registro.'); }
            } catch (err) { handleNotification(err.message, 'error'); } 
            finally { setLoading(false); }
        };
        fetchRegistro();
    }, [id, navigate, handleNotification]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/acompanhamento/registros/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                handleNotification('Registro atualizado com sucesso!', 'success');
                navigate('/painel');
            } else {
                const data = await response.json();
                handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error');
            }
        } catch (err) { handleNotification('Erro de rede.', 'error'); }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Paper sx={{ p: 3, mt: 5 }}>
                <Typography component="h1" variant="h5" gutterBottom>Editar Registro</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><TextField type="number" name="peso" label="Peso (kg)" value={formData.peso} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField type="number" name="agua_ml" label="Água (ml)" value={formData.agua_ml} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12}><FormControlLabel control={<Checkbox checked={formData.vitaminas_tomadas} onChange={handleChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas" /></Grid>
                        <Grid item xs={12}><TextField name="observacoes" label="Observações do dia..." value={formData.observacoes} onChange={handleChange} multiline rows={4} fullWidth /></Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => navigate('/painel')}>Cancelar</Button>
                        <Button type="submit" variant="contained">Salvar Alterações</Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
export default EditarRegistro;