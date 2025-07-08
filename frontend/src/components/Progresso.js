// frontend/src/components/Progresso.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

import { 
    Box, Container, Grid, Paper, Typography, ButtonGroup, Button, CircularProgress 
} from '@mui/material';

function Progresso({ handleNotification }) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('tudo');

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        try {
            const [perfilRes, registrosRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);
            if (!perfilRes.ok || !registrosRes.ok) { throw new Error('Falha ao carregar dados de progresso.'); }
            const perfilData = await perfilRes.json();
            const registrosData = await registrosRes.json();
            setPerfil(perfilData);
            setRegistros(registrosData);
        } catch (err) {
            handleNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const getRegistrosFiltrados = () => {
        if (!registros) return [];
        const agora = new Date();
        if (filtroPeriodo === '7d') {
            const dataLimite = new Date();
            dataLimite.setDate(agora.getDate() - 7);
            return registros.filter(reg => new Date(reg.data_registro) >= dataLimite);
        }
        if (filtroPeriodo === '30d') {
            const dataLimite = new Date();
            dataLimite.setMonth(agora.getMonth() - 1);
            return registros.filter(reg => new Date(reg.data_registro) >= dataLimite);
        }
        return registros;
    };
    const registrosFiltrados = getRegistrosFiltrados();

    let ultimoRegistroComPeso = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).find(reg => reg.peso);
    let imc = null;
    let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Meu Progresso</Typography>

            {/* Cards com as métricas */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h5" color="primary">{ultimoRegistroComPeso ? `${ultimoRegistroComPeso.peso} kg` : 'N/A'}</Typography><Typography variant="overline" color="text.secondary">Peso Atual</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h5" color="primary">{imc || 'N/A'}</Typography><Typography variant="overline" color="text.secondary">IMC Atual</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h5" color={perdaTotal >= 0 ? "green" : "red"}>{perdaTotal !== null ? `${perdaTotal} kg` : 'N/A'}</Typography><Typography variant="overline" color="text.secondary">Peso Perdido</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h5" color="primary">{perfil.meta_peso ? `${perfil.meta_peso} kg` : 'N/A'}</Typography><Typography variant="overline" color="text.secondary">Meta de Peso</Typography></Paper></Grid>
            </Grid>

            {/* Filtros e Gráficos */}
            <Paper sx={{p:2}}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <ButtonGroup variant="outlined">
                        <Button variant={filtroPeriodo === '7d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('7d')}>7 dias</Button>
                        <Button variant={filtroPeriodo === '30d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('30d')}>30 dias</Button>
                        <Button variant={filtroPeriodo === 'tudo' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('tudo')}>Tudo</Button>
                    </ButtonGroup>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                        <Typography component="h3" variant="h6" color="primary" align="center">Evolução do Peso</Typography>
                        <Box sx={{height: 300}}><GraficoPeso data={registrosFiltrados} /></Box>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography component="h3" variant="h6" color="primary" align="center">Consumo de Água</Typography>
                        <Box sx={{height: 300}}><GraficoAgua data={registrosFiltrados} /></Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Progresso;