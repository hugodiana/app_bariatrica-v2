// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

// Importando todos os componentes necessários do Material-UI
import { 
    CssBaseline, Box, Container, Grid, Paper, Typography, Button, ButtonGroup,
    TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
    IconButton, Divider, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function PainelPrincipal({ handleNotification }) {
    const navigate = useNavigate();
    // Estados para os dados principais
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [refeicoes, setRefeicoes] = useState([]); // Estado para refeições
    
    // Estados para os formulários
    const [registroFormData, setRegistroFormData] = useState({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' });
    const [refeicaoFormData, setRefeicaoFormData] = useState({ tipo: 'cafe_da_manha', horario: '', descricao: '' });

    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('tudo');

    // --- LÓGICA DE BUSCA DE DADOS ---
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
            setPerfil(perfilData);
            setRegistros(registrosData);
            setRefeicoes(refeicoesData);
        } catch (err) { handleNotification(err.message, 'error'); navigate('/login'); } 
        finally { setLoading(false); }
    }, [navigate, handleNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
    
    // --- LÓGICA PARA REGISTRO DIÁRIO ---
    const handleRegistroChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setRegistroFormData({ ...registroFormData, [e.target.name]: value }); };
    const handleRegistroSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(registroFormData) }); if (response.status === 201) { handleNotification('Registro salvo com sucesso!', 'success'); setRegistroFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRegistroDelete = async (registroId) => { if (window.confirm('Tem certeza?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/${registroId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Registro apagado.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };

    // --- LÓGICA PARA REFEIÇÕES ---
    const handleRefeicaoChange = (e) => { setRefeicaoFormData({ ...refeicaoFormData, [e.target.name]: e.target.value }); };
    const handleRefeicaoSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(refeicaoFormData) }); if (response.status === 201) { handleNotification('Refeição salva com sucesso!', 'success'); setRefeicaoFormData({ tipo: 'cafe_da_manha', horario: '', descricao: '' }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar refeição.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRefeicaoDelete = async (refeicaoId) => { if (window.confirm('Apagar esta refeição?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/${refeicaoId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Refeição apagada.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };

    // --- LÓGICAS DE VISUALIZAÇÃO ---
    const getRegistrosFiltrados = () => { if (!registros) return []; const agora = new Date(); if (filtroPeriodo === '7d') { const dataLimite = new Date(); dataLimite.setDate(agora.getDate() - 7); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } if (filtroPeriodo === '30d') { const dataLimite = new Date(); dataLimite.setMonth(agora.getMonth() - 1); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } return registros; };
    const registrosFiltrados = getRegistrosFiltrados();
    const hojeString = new Date().toISOString().split('T')[0];
    const refeicoesDeHoje = refeicoes.filter(r => r.data_registro === hojeString);
    let ultimoRegistroComPeso = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).find(reg => reg.peso);
    let imc = null;
    let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    if (loading) return <div>Carregando...</div>;
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* ... (Seção de Perfil e Gráficos continuam aqui) ... */}
                    <Grid item xs={12} md={4}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>{perfil && (<> <Typography component="h2" variant="h6" color="primary" gutterBottom>Meu Perfil</Typography> <Typography component="p" variant="h5">Olá, {perfil.usuario.first_name || perfil.usuario.username}!</Typography> {imc && <Typography variant="body1" sx={{ mt: 2 }}><strong>IMC Atual:</strong> {imc}</Typography>} {perdaTotal !== null && <Typography variant="body1" color={perdaTotal >= 0 ? "green" : "red"}><strong>Peso Perdido:</strong> {perdaTotal} kg</Typography>} <Divider sx={{ my: 2 }} /> <Typography color="text.secondary" sx={{ flex: 1 }}>Data da Cirurgia: {perfil.data_cirurgia || 'Não informada'}</Typography> <Typography color="text.secondary">Peso Inicial: {perfil.peso_inicial || 'Não informado'} kg</Typography> <Link to="/editar-perfil"><Button size="small" sx={{mt: 2, justifyContent: 'flex-start'}}>Editar Perfil</Button></Link> <Button size="small" color="error" onClick={handleLogout} sx={{mt: 1, justifyContent: 'flex-start'}}>Sair</Button> </>)}</Paper></Grid>
                    <Grid item xs={12} md={8}><Box sx={{ mb: 2, textAlign: 'center' }}><ButtonGroup variant="outlined"><Button variant={filtroPeriodo === '7d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('7d')}>7 dias</Button><Button variant={filtroPeriodo === '30d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('30d')}>30 dias</Button><Button variant={filtroPeriodo === 'tudo' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('tudo')}>Tudo</Button></ButtonGroup></Box><Grid container spacing={3}><Grid item xs={12}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}><Typography component="h3" variant="h6" color="primary">Evolução do Peso</Typography><GraficoPeso data={registrosFiltrados} /></Paper></Grid><Grid item xs={12}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}><Typography component="h3" variant="h6" color="primary">Consumo de Água</Typography><GraficoAgua data={registrosFiltrados} /></Paper></Grid></Grid></Grid>

                    {/* --- Seção de Registro Diário --- */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Registro Geral do Dia</Typography>
                            <Box component="form" onSubmit={handleRegistroSubmit} noValidate sx={{ mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}><TextField type="number" name="peso" label="Peso de Hoje (kg)" value={registroFormData.peso} onChange={handleRegistroChange} fullWidth /></Grid>
                                    <Grid item xs={12} sm={6}><TextField type="number" name="agua_ml" label="Água Total (ml)" value={registroFormData.agua_ml} onChange={handleRegistroChange} fullWidth /></Grid>
                                    <Grid item xs={12}><FormControlLabel control={<Checkbox checked={registroFormData.vitaminas_tomadas} onChange={handleRegistroChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas hoje" /></Grid>
                                    <Grid item xs={12}><TextField name="observacoes" label="Observações gerais do dia..." value={registroFormData.observacoes} onChange={handleRegistroChange} multiline rows={2} fullWidth /></Grid>
                                </Grid>
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar/Atualizar Registro do Dia</Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* --- NOVA SEÇÃO DE REFEIÇÕES --- */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Refeições de Hoje</Typography>
                            <Box component="form" onSubmit={handleRefeicaoSubmit} sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}><FormControl fullWidth><InputLabel>Tipo</InputLabel><Select name="tipo" value={refeicaoFormData.tipo} label="Tipo" onChange={handleRefeicaoChange}><MenuItem value="cafe_da_manha">Café da Manhã</MenuItem><MenuItem value="lanche_da_manha">Lanche da Manhã</MenuItem><MenuItem value="almoco">Almoço</MenuItem><MenuItem value="lanche_da_tarde">Lanche da Tarde</MenuItem><MenuItem value="jantar">Jantar</MenuItem><MenuItem value="ceia">Ceia</MenuItem><MenuItem value="outra">Outra</MenuItem></Select></FormControl></Grid>
                                    <Grid item xs={12} sm={4}><TextField type="time" name="horario" value={refeicaoFormData.horario} onChange={handleRefeicaoChange} fullWidth InputLabelProps={{ shrink: true }} label="Horário" /></Grid>
                                    <Grid item xs={12} sm={4}><Button type="submit" variant="contained" sx={{height: '56px'}}>Adicionar</Button></Grid>
                                    <Grid item xs={12}><TextField name="descricao" label="Descrição da refeição" value={refeicaoFormData.descricao} onChange={handleRefeicaoChange} fullWidth multiline rows={2}/></Grid>
                                </Grid>
                            </Box>
                            <List>
                                {refeicoesDeHoje.map(refeicao => (
                                    <ListItem key={refeicao.id} disablePadding secondaryAction={<IconButton edge="end" onClick={() => handleRefeicaoDelete(refeicao.id)}><DeleteIcon /></IconButton>}>
                                        <ListItemText primary={`${refeicao.horario} - ${refeicao.tipo.replace(/_/g, ' ')}`} secondary={refeicao.descricao} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    
                    {/* --- Seção de Histórico --- */}
                    <Grid item xs={12}><Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Registros</Typography><List>{registrosFiltrados.map(reg => ( <ListItem key={reg.id} secondaryAction={<><IconButton edge="end" component={Link} to={`/editar-registro/${reg.id}`} sx={{ mr: 1 }}><EditIcon /></IconButton><IconButton edge="end" onClick={() => handleRegistroDelete(reg.id)}><DeleteIcon /></IconButton></>}> <ListItemText primary={`Data: ${new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - Peso: ${reg.peso ? `${reg.peso} kg` : 'N/A'}`} secondary={`Obs: ${reg.observacoes || 'Nenhuma'}`} /> </ListItem> ))} </List></Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default PainelPrincipal;