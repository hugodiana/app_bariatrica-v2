// frontend/src/components/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container } from '@mui/material';

// Importando nossos novos widgets
import WeightProgressWidget from './WeightProgressWidget';
import RemindersWidget from './RemindersWidget';
// Futuramente, adicionaremos mais widgets aqui

function HomePage({ handleNotification }) {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } });
            if (!response.ok) { throw new Error('Falha ao carregar dados.'); }
            const data = await response.json();
            setRegistros(data);
        } catch (err) { handleNotification(err.message, 'error'); } 
        finally { setLoading(false); }
    }, [navigate, handleNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <div>Carregando...</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Widget de Progresso de Peso */}
                <Grid item xs={12} md={8} lg={9}>
                    <WeightProgressWidget data={registros} />
                </Grid>
                {/* Widget de Lembretes */}
                <Grid item xs={12} md={4} lg={3}>
                    <RemindersWidget />
                </Grid>
                {/* Aqui podemos adicionar os outros widgets como Checklist e Compromissos */}
            </Grid>
        </Container>
    );
}
export default HomePage;