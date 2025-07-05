// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

// Adicionamos ButtonGroup aos imports do Material-UI
import { 
    CssBaseline, Box, Container, Grid, Paper, Typography, Button, ButtonGroup,
    TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
    IconButton, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function PainelPrincipal({ handleNotification }) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [formData, setFormData] = useState({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' });
    const [loading, setLoading] = useState(true);
    
    // 1. NOVO ESTADO PARA CONTROLAR O FILTRO
    const [filtroPeriodo, setFiltroPeriodo] = useState('tudo'); // Opções: '7d', '30d', 'tudo'
    
    // ... (toda a sua lógica de fetchData, handlers, etc. continua a mesma)
    const fetchData = useCallback(async () => { const token = localStorage.getItem('authToken'); if (!token) { navigate('/login'); return; } setLoading(true); try { const [perfilRes, registrosRes] = await Promise.all([ fetch(`${process.env.REACT_APP_API_URL}/api/meu-perfil/`, { headers: { 'Authorization': `Token ${token}` } }), fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } }) ]); if (!perfilRes.ok || !registrosRes.ok) { throw new Error('Falha ao carregar dados.'); } const perfilData = await perfilRes.json(); const registrosData = await registrosRes.json(); setPerfil(perfilData); setRegistros(registrosData); } catch (err) { handleNotification(err.message, 'error'); navigate('/login'); } finally { setLoading(false); } }, [navigate, handleNotification]);
    useEffect(() => { fetchData(); }, [fetchData]);
    const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
    const handleChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setFormData({ ...formData, [e.target.name]: value }); };
    const handleSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(formData) }); if (response.status === 201) { handleNotification('Registro salvo com sucesso!', 'success'); setFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleDelete = async (registroId) => { if (window.confirm('Tem certeza?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/${registroId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Registro apagado.', 'info'); setRegistros(registros.filter(reg => reg.id !== registroId)); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };
    
    // ... (lógica de cálculo de IMC e Perda Total continua a mesma)
    let ultimoRegistroComPeso = registros.find(reg => reg.peso);
    let imc = null;
    let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    // 2. NOVA LÓGICA PARA FILTRAR OS DADOS
    const getRegistrosFiltrados = () => {
        const agora = new Date();
        if (filtroPeriodo === '7d') {
            const dataLimite = new Date();
            dataLimite.setDate(agora.getDate() - 7);
            return registros.filter(reg => new Date(reg.data_registro) >= dataLimite);
        }
        if (filtroPeriodo === '30d') {
            const dataLimite = new Date();
            dataLimite.setDate(agora.getDate() - 30);
            return registros.filter(reg => new Date(reg.data_registro) >= dataLimite);
        }
        return registros; // Caso 'tudo'
    };
    const registrosFiltrados = getRegistrosFiltrados();

    if (loading) return <div>Carregando...</div>;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Seção do Perfil */}
                    <Grid item xs={12} md={4}>
                        {/* ... (código do perfil continua igual) ... */}
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>{perfil && (<> <Typography component="h2" variant="h6" color="primary" gutterBottom>Meu Perfil</Typography> <Typography component="p" variant="h5">Olá, {perfil.usuario.first_name || perfil.usuario.username}!</Typography> {imc && <Typography variant="body1" sx={{ mt: 2 }}><strong>IMC Atual:</strong> {imc}</Typography>} {perdaTotal !== null && <Typography variant="body1" color={perdaTotal >= 0 ? "green" : "red"}><strong>Peso Perdido:</strong> {perdaTotal} kg</Typography>} <Divider sx={{ my: 2 }} /> <Typography color="text.secondary" sx={{ flex: 1 }}>Data da Cirurgia: {perfil.data_cirurgia || 'Não informada'}</Typography> <Typography color="text.secondary">Peso Inicial: {perfil.peso_inicial || 'Não informado'} kg</Typography> <Link to="/editar-perfil"><Button size="small" sx={{mt: 2, justifyContent: 'flex-start'}}>Editar Perfil</Button></Link> <Button size="small" color="error" onClick={handleLogout} sx={{mt: 1, justifyContent: 'flex-start'}}>Sair</Button> </>)}</Paper>
                    </Grid>
                    {/* Seção de Gráficos */}
                    <Grid item xs={12} md={8}>
                        {/* 3. BOTÕES DE FILTRO */}
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <ButtonGroup variant="outlined" aria-label="filtro de período">
                                <Button variant={filtroPeriodo === '7d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('7d')}>7 dias</Button>
                                <Button variant={filtroPeriodo === '30d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('30d')}>30 dias</Button>
                                <Button variant={filtroPeriodo === 'tudo' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('tudo')}>Tudo</Button>
                            </ButtonGroup>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}>
                                    <Typography component="h3" variant="h6" color="primary">Evolução do Peso</Typography>
                                    {/* 4. GRÁFICO USA DADOS FILTRADOS */}
                                    <GraficoPeso data={registrosFiltrados} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}>
                                    <Typography component="h3" variant="h6" color="primary">Consumo de Água</Typography>
                                    {/* 4. GRÁFICO USA DADOS FILTRADOS */}
                                    <GraficoAgua data={registrosFiltrados} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* ... (Seção de Registro e Histórico continuam iguais) ... */}
                    <Grid item xs={12}><Paper sx={{ p: 2 }}><Typography component="h2" variant="h6" color="primary" gutterBottom>Registro de Hoje</Typography><Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}><Grid container spacing={2}><Grid item xs={12} sm={4}><TextField type="number" name="peso" label="Peso (kg)" value={formData.peso} onChange={handleChange} fullWidth /></Grid><Grid item xs={12} sm={4}><TextField type="number" name="agua_ml" label="Água (ml)" value={formData.agua_ml} onChange={handleChange} fullWidth /></Grid><Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.vitaminas_tomadas} onChange={handleChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas" /></Grid><Grid item xs={12}><TextField name="observacoes" label="Observações do dia..." value={formData.observacoes} onChange={handleChange} multiline rows={2} fullWidth /></Grid></Grid><Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar Registro</Button></Box></Paper></Grid>
                    <Grid item xs={12}><Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Registros</Typography><List>{registros && registros.map(reg => ( <ListItem key={reg.id} secondaryAction={<><IconButton edge="end" aria-label="edit" component={Link} to={`/editar-registro/${reg.id}`} sx={{ mr: 1 }}><EditIcon /></IconButton><IconButton edge="end" aria-label="delete" onClick={() => handleDelete(reg.id)}><DeleteIcon /></IconButton></>}> <ListItemText primary={`Data: ${new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - Peso: ${reg.peso ? `${reg.peso} kg` : 'N/A'}`} secondary={`Obs: ${reg.observacoes || 'Nenhuma'}`} /> </ListItem> ))} </List> </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default PainelPrincipal;