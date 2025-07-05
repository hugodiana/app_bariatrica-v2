// frontend/src/components/EditarPerfil.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Container, Paper, Typography, Button, TextField, Grid } from '@mui/material';

function EditarPerfil({ handleNotification }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ data_cirurgia: '', peso_inicial: '', meta_peso: '', altura_cm: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        const fetchPerfil = async () => {
            try {
                // CORREÇÃO AQUI
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, { headers: { 'Authorization': `Token ${token}` } });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({ data_cirurgia: data.data_cirurgia || '', peso_inicial: data.peso_inicial || '', meta_peso: data.meta_peso || '', altura_cm: data.altura_cm || '' });
                } else { throw new Error('Falha ao carregar perfil.'); }
            } catch (err) { handleNotification(err.message, 'error'); } 
            finally { setLoading(false); }
        };
        fetchPerfil();
    }, [navigate, handleNotification]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            // CORREÇÃO AQUI
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                handleNotification('Perfil atualizado com sucesso!', 'success');
                navigate('/painel');
            } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error'); }
        } catch (err) { handleNotification('Erro de rede.', 'error'); }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <Container component="main" maxWidth="md"><CssBaseline /><Paper sx={{ p: 3, mt: 5 }}><Typography component="h1" variant="h5" gutterBottom>Editar Perfil</Typography><Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}><Grid container spacing={2}><Grid item xs={12}><TextField type="date" name="data_cirurgia" label="Data da Cirurgia" value={formData.data_cirurgia} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth /></Grid><Grid item xs={12} sm={4}><TextField type="number" name="peso_inicial" label="Peso Inicial (kg)" value={formData.peso_inicial} onChange={handleChange} fullWidth /></Grid><Grid item xs={12} sm={4}><TextField type="number" name="altura_cm" label="Altura (cm)" value={formData.altura_cm} onChange={handleChange} fullWidth /></Grid><Grid item xs={12} sm={4}><TextField type="number" step="0.1" name="meta_peso" label="Meta de Peso (kg)" value={formData.meta_peso} onChange={handleChange} fullWidth /></Grid></Grid><Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}><Button variant="outlined" onClick={() => navigate('/painel')}>Cancelar</Button><Button type="submit" variant="contained">Salvar Alterações</Button></Box></Box></Paper></Container>
    );
}
export default EditarPerfil;