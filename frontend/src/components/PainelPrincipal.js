// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

// CORREÇÃO: A lista de imports foi limpa para incluir apenas o que é usado
import { 
    Box, Paper, Grid, Typography, Button, 
    List, ListItem, ListItemText, Divider 
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventNoteIcon from '@mui/icons-material/EventNote';

function PainelPrincipal({ handleNotification }) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [refeicoes, setRefeicoes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const [perfilRes, registrosRes, refeicoesRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);
            if (!perfilRes.ok || !registrosRes.ok || !refeicoesRes.ok) { throw new Error('Falha ao carregar dados.'); }
            const perfilData = await perfilRes.json();
            const registrosData = await registrosRes.json();
            const refeicoesData = await refeicoesRes.json();
            if (!perfilData.peso_inicial || !perfilData.altura_cm) {
                handleNotification('Bem-vindo(a)! Por favor, complete seu perfil para começar.', 'info');
                navigate('/editar-perfil');
                return; // Para a execução para não carregar o painel
            }
            setPerfil(perfilData);
            setRegistros(registrosData);
            setRefeicoes(refeicoesData);
        } catch (err) { handleNotification(err.message, 'error'); } 
        finally { setLoading(false); }
    }, [navigate, handleNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Lógicas de cálculo e filtro
    const hojeString = new Date().toISOString().split('T')[0];
    const registroDeHoje = registros.find(r => r.data_registro === hojeString);
    const refeicoesDeHoje = refeicoes.filter(refeicao => refeicao.registro_diario === registroDeHoje?.id);
    let ultimoRegistroComPeso = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).find(reg => reg.peso);
    let imc = null; let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    if (loading) return <Box sx={{ p: 3 }}>Carregando...</Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Olá, {perfil?.usuario.first_name || perfil?.usuario.username}!</Typography>
            <Typography variant="body1" color="text.secondary">Aqui está o resumo do seu progresso.</Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Card 1: Métricas Chave */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h4" color="primary">{imc || 'N/A'}</Typography>
                        <Typography variant="overline" color="text.secondary">IMC Atual</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h4" color={perdaTotal >= 0 ? "green" : "red"}>{perdaTotal !== null ? `${perdaTotal} kg` : 'N/A'}</Typography>
                        <Typography variant="overline" color="text.secondary">Peso Perdido</Typography>
                    </Paper>
                </Grid>
                
                {/* Card 2: Ações Rápidas */}
                <Grid item xs={12} md={6}>
                     <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                        <Button component={Link} to="/dieta" variant="contained" startIcon={<RestaurantMenuIcon />}>Registrar Refeição</Button>
                        <Button component={Link} to="/agenda" variant="outlined" startIcon={<EventNoteIcon />}>Ver Agenda</Button>
                    </Paper>
                </Grid>

                {/* Card 3: Gráfico de Progresso */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                        <Typography component="h3" variant="h6" color="primary" gutterBottom>Progresso do Peso</Typography>
                        <GraficoPeso data={registros} />
                    </Paper>
                </Grid>

                {/* Card 4: Refeições de Hoje */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2, height: 300, overflow: 'auto' }}>
                        <Typography component="h3" variant="h6" color="primary" gutterBottom>Refeições de Hoje</Typography>
                        <List dense>
                            {refeicoesDeHoje.length > 0 ? refeicoesDeHoje.map(refeicao => (
                                <ListItem key={refeicao.id}>
                                    <ListItemText 
                                        primary={`${refeicao.horario.slice(0,5)} - ${refeicao.tipo.replace(/_/g, " ")}`}
                                        secondary={refeicao.itens.map(item => item.alimento.nome).join(', ')}
                                    />
                                </ListItem>
                            )) : (
                                <Typography variant="body2" color="text.secondary" sx={{pt: 2}}>Nenhuma refeição registrada hoje.</Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PainelPrincipal;