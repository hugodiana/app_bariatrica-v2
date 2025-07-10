// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

// Importando todos os componentes necessários do Material-UI
import { 
    CssBaseline, Box, Container, Grid, Paper, Typography, Button, ButtonGroup,
    TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
    IconButton, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventNoteIcon from '@mui/icons-material/EventNote';

function PainelPrincipal({ handleNotification }) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('tudo');
    const [registroFormData, setRegistroFormData] = useState({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' });

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const [perfilRes, registrosRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);
            if (!perfilRes.ok || !registrosRes.ok) { throw new Error('Falha ao carregar dados.'); }
            const perfilData = await perfilRes.json();
            const registrosData = await registrosRes.json();
            
            if (!perfilData.peso_inicial || !perfilData.altura_cm) {
                handleNotification('Bem-vindo(a)! Por favor, complete seu perfil para começar.', 'info');
                navigate('/editar-perfil');
                return;
            }

            setPerfil(perfilData);
            setRegistros(registrosData);
        } catch (err) { handleNotification(err.message, 'error'); } 
        finally { setLoading(false); }
    }, [navigate, handleNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
    const handleRegistroChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setRegistroFormData({ ...registroFormData, [e.target.name]: value }); };
    const handleRegistroSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(registroFormData) }); if (response.status === 201 || response.status === 200) { handleNotification('Registro do dia salvo!', 'success'); setRegistroFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRegistroDelete = async (registroId) => { if (window.confirm('Tem certeza?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/${registroId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Registro apagado.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };

    const getRegistrosFiltrados = () => { if (!registros) return []; const agora = new Date(); if (filtroPeriodo === '7d') { const dataLimite = new Date(); dataLimite.setDate(agora.getDate() - 7); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } if (filtroPeriodo === '30d') { const dataLimite = new Date(); dataLimite.setMonth(agora.getMonth() - 1); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } return registros; };
    const registrosFiltrados = getRegistrosFiltrados();
    let ultimoRegistroComPeso = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).find(reg => reg.peso);
    let imc = null; let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    if (loading) return <div>Carregando...</div>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Olá, {perfil?.usuario.first_name || perfil?.usuario.username}!</Typography>
            <Typography variant="body1" color="text.secondary">Aqui está o resumo do seu progresso.</Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Card de Métricas Chave */}
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}><Typography variant="h5" color="primary">{imc || 'N/A'}</Typography><Typography variant="overline" color="text.secondary">IMC Atual</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}><Typography variant="h5" color={perdaTotal >= 0 ? "green" : "red"}>{perdaTotal !== null ? `${perdaTotal} kg` : 'N/A'}</Typography><Typography variant="overline" color="text.secondary">Peso Perdido</Typography></Paper></Grid>
                
                {/* Card de Ações Rápidas */}
                <Grid item xs={12} md={6}>
                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="overline" color="text.secondary">Ações Rápidas</Typography>
                        <Box sx={{mt: 1}}>
                            <Button component={Link} to="/dieta" variant="contained" startIcon={<RestaurantMenuIcon />} sx={{ m: 1 }}>Registrar Refeição</Button>
                            <Button component={Link} to="/agenda" variant="outlined" startIcon={<EventNoteIcon />} sx={{ m: 1 }}>Ver Agenda</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Card de Gráfico de Progresso */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <ButtonGroup variant="outlined"><Button variant={filtroPeriodo === '7d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('7d')}>7 dias</Button><Button variant={filtroPeriodo === '30d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('30d')}>30 dias</Button><Button variant={filtroPeriodo === 'tudo' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('tudo')}>Tudo</Button></ButtonGroup>
                        </Box>
                        <Typography component="h3" variant="h6" color="primary" gutterBottom>Progresso do Peso</Typography>
                        <GraficoPeso data={registrosFiltrados} />
                    </Paper>
                </Grid>

                {/* Card de Registro Geral do Dia */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Registro Geral do Dia</Typography>
                        <Typography variant="body2" color="text.secondary">Use este card para registrar seu peso do dia, consumo de água e outras observações gerais.</Typography>
                        <Box component="form" onSubmit={handleRegistroSubmit} noValidate sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}><TextField type="number" name="peso" label="Peso de Hoje (kg)" value={registroFormData.peso} onChange={handleRegistroChange} fullWidth /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField type="number" name="agua_ml" label="Água Total (ml)" value={registroFormData.agua_ml} onChange={handleRegistroChange} fullWidth /></Grid>
                                <Grid item xs={12} md={6}><TextField name="observacoes" label="Observações gerais do dia..." value={registroFormData.observacoes} onChange={handleRegistroChange} multiline rows={1} fullWidth /></Grid>
                                <Grid item xs={12}><FormControlLabel control={<Checkbox checked={registroFormData.vitaminas_tomadas} onChange={handleRegistroChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas hoje" /></Grid>
                            </Grid>
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar Registro do Dia</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Histórico de Registros */}
                <Grid item xs={12}>
                    <Paper sx={{p: 2}}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Registros Gerais</Typography>
                        <List>{registrosFiltrados.map(reg => ( <ListItem key={reg.id} secondaryAction={<><IconButton edge="end" component={Link} to={`/editar-registro/${reg.id}`} sx={{ mr: 1 }}><EditIcon /></IconButton><IconButton edge="end" onClick={() => handleRegistroDelete(reg.id)}><DeleteIcon /></IconButton></>}><ListItemText primary={`Data: ${new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - Peso: ${reg.peso ? `${reg.peso} kg` : 'N/A'}`} secondary={`Obs: ${reg.observacoes || 'Nenhuma'}`} /></ListItem> ))} </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PainelPrincipal;