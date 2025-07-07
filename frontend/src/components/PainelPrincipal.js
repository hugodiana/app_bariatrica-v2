// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';
import GraficoAgua from './GraficoAgua';

// Importando todos os componentes necessários do Material-UI
import {
    CssBaseline, Box, Container, Grid, Paper, Typography, Button, ButtonGroup,
    TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText,
    IconButton, Divider, Select, MenuItem, InputLabel, FormControl, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // A importação que faltava

function PainelPrincipal({ handleNotification }) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [refeicoes, setRefeicoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('tudo');
    const [registroFormData, setRegistroFormData] = useState({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' });
    const [refeicaoAtual, setRefeicaoAtual] = useState({ tipo: 'almoco', horario: new Date().toTimeString().slice(0, 5), itens: [] });
    const [alimentoSelecionado, setAlimentoSelecionado] = useState(null);
    const [alimentoBuscaResults, setAlimentoBuscaResults] = useState([]);
    const [quantidadeAlimento, setQuantidadeAlimento] = useState('');
    const [autocompleteKey, setAutocompleteKey] = useState(0);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        // setLoading(true); // Opcional: remover para evitar piscar a tela
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
        } catch (err) { handleNotification(err.message, 'error'); }
        finally { setLoading(false); }
    }, [navigate, handleNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
    const handleRegistroChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setRegistroFormData({ ...registroFormData, [e.target.name]: value }); };
    const handleRegistroSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify(registroFormData) }); if (response.status === 201) { handleNotification('Registro salvo!', 'success'); setRegistroFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRegistroDelete = async (registroId) => { if (window.confirm('Tem certeza?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/${registroId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Registro apagado.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };
    const handleBuscaAlimento = async (event, newValue) => { if (newValue && newValue.length > 2) { const token = localStorage.getItem('authToken'); const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/alimentos/?search=${newValue}`, { headers: { 'Authorization': `Token ${token}` } }); const data = await response.json(); setAlimentoBuscaResults(data); } else { setAlimentoBuscaResults([]); } };
    const handleAddItemNaRefeicao = () => { if (!alimentoSelecionado || !quantidadeAlimento) { handleNotification('Selecione um alimento e uma quantidade.', 'warning'); return; } setRefeicaoAtual({ ...refeicaoAtual, itens: [...refeicaoAtual.itens, { alimento: alimentoSelecionado, quantidade: quantidadeAlimento }] }); setAlimentoSelecionado(null); setQuantidadeAlimento(''); setAlimentoBuscaResults([]); setAutocompleteKey(prevKey => prevKey + 1); };
    const handleRefeicaoSubmit = async (e) => { e.preventDefault(); if (refeicaoAtual.itens.length === 0 || !refeicaoAtual.horario) { handleNotification('Adicione itens e defina um horário.', 'error'); return; } const token = localStorage.getItem('authToken'); const payload = { tipo: refeicaoAtual.tipo, horario: refeicaoAtual.horario, itens: refeicaoAtual.itens.map(item => ({ alimento_id: item.alimento.id, quantidade: item.quantidade })) }; try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify(payload) }); if (response.status === 201) { handleNotification('Refeição salva com sucesso!', 'success'); setRefeicaoAtual({ tipo: 'almoco', horario: new Date().toTimeString().slice(0, 5), itens: [] }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar refeição.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRefeicaoDelete = async (refeicaoId) => { if (window.confirm('Apagar esta refeição?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/${refeicaoId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Refeição apagada.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };

    const getRegistrosFiltrados = () => { if (!registros) return []; const agora = new Date(); if (filtroPeriodo === '7d') { const dataLimite = new Date(); dataLimite.setDate(agora.getDate() - 7); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } if (filtroPeriodo === '30d') { const dataLimite = new Date(); dataLimite.setMonth(agora.getMonth() - 1); return registros.filter(reg => new Date(reg.data_registro) >= dataLimite); } return registros; };
    const registrosFiltrados = getRegistrosFiltrados();
    const hojeString = new Date().toISOString().split('T')[0];
    const registroDeHoje = registros.find(r => r.data_registro === hojeString);
    const refeicoesDeHoje = refeicoes.filter(refeicao => refeicao.registro_diario === registroDeHoje?.id);
    let ultimoRegistroComPeso = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).find(reg => reg.peso);
    let imc = null; let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) { const alturaMetros = perfil.altura_cm / 100; imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1); }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) { perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1); }

    if (loading) return <div>Carregando...</div>;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>{perfil && (<> <Typography component="h2" variant="h6" color="primary" gutterBottom>Meu Perfil</Typography> <Typography component="p" variant="h5">Olá, {perfil.usuario.first_name || perfil.usuario.username}!</Typography> {imc && <Typography variant="body1" sx={{ mt: 2 }}><strong>IMC Atual:</strong> {imc}</Typography>} {perdaTotal !== null && <Typography variant="body1" color={perdaTotal >= 0 ? "green" : "red"}><strong>Peso Perdido:</strong> {perdaTotal} kg</Typography>} <Divider sx={{ my: 2 }} /> <Typography color="text.secondary" sx={{ flex: 1 }}>Data da Cirurgia: {perfil.data_cirurgia || 'Não informada'}</Typography> <Typography color="text.secondary">Peso Inicial: {perfil.peso_inicial || 'Não informado'} kg</Typography> <Link to="/editar-perfil"><Button size="small" sx={{ mt: 2, justifyContent: 'flex-start' }}>Editar Perfil</Button></Link> <Button size="small" color="error" onClick={handleLogout} sx={{ mt: 1, justifyContent: 'flex-start' }}>Sair</Button> </>)}</Paper></Grid>
                    <Grid item xs={12} md={8}><Box sx={{ mb: 2, textAlign: 'center' }}><ButtonGroup variant="outlined"><Button variant={filtroPeriodo === '7d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('7d')}>7 dias</Button><Button variant={filtroPeriodo === '30d' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('30d')}>30 dias</Button><Button variant={filtroPeriodo === 'tudo' ? 'contained' : 'outlined'} onClick={() => setFiltroPeriodo('tudo')}>Tudo</Button></ButtonGroup></Box><Grid container spacing={3}><Grid item xs={12}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}><Typography component="h3" variant="h6" color="primary">Evolução do Peso</Typography><GraficoPeso data={registrosFiltrados} /></Paper></Grid><Grid item xs={12}><Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}><Typography component="h3" variant="h6" color="primary">Consumo de Água</Typography><GraficoAgua data={registrosFiltrados} /></Paper></Grid></Grid></Grid>
                    <Grid item xs={12} md={6}><Paper sx={{ p: 2, height: '100%' }}><Typography component="h2" variant="h6" color="primary" gutterBottom>Registro Geral do Dia</Typography><Box component="form" onSubmit={handleRegistroSubmit} noValidate sx={{ mt: 1 }}><Grid container spacing={2}><Grid item xs={12} sm={6}><TextField type="number" name="peso" label="Peso de Hoje (kg)" value={registroFormData.peso} onChange={handleRegistroChange} fullWidth /></Grid><Grid item xs={12} sm={6}><TextField type="number" name="agua_ml" label="Água Total (ml)" value={registroFormData.agua_ml} onChange={handleRegistroChange} fullWidth /></Grid><Grid item xs={12}><FormControlLabel control={<Checkbox checked={registroFormData.vitaminas_tomadas} onChange={handleRegistroChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas hoje" /></Grid><Grid item xs={12}><TextField name="observacoes" label="Observações gerais do dia..." value={registroFormData.observacoes} onChange={handleRegistroChange} multiline rows={2} fullWidth /></Grid></Grid><Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar Registro do Dia</Button></Box></Paper></Grid>
                    <Grid item xs={12} md={6}><Paper sx={{ p: 2, height: '100%' }}><Typography component="h2" variant="h6" color="primary" gutterBottom>Registrar Refeição</Typography><Box component="form" onSubmit={handleRefeicaoSubmit}><Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}><Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Tipo</InputLabel><Select name="tipo" value={refeicaoAtual.tipo} label="Tipo" onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, tipo: e.target.value })}><MenuItem value="cafe_da_manha">Café da Manhã</MenuItem><MenuItem value="lanche_da_manha">Lanche da Manhã</MenuItem><MenuItem value="almoco">Almoço</MenuItem><MenuItem value="lanche_da_tarde">Lanche da Tarde</MenuItem><MenuItem value="jantar">Jantar</MenuItem><MenuItem value="ceia">Ceia</MenuItem></Select></FormControl></Grid><Grid item xs={12} sm={6}><TextField type="time" name="horario" value={refeicaoAtual.horario} onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, horario: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} label="Horário" /></Grid></Grid><Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}><Grid item xs={12} sm={7}><Autocomplete key={autocompleteKey} options={alimentoBuscaResults} getOptionLabel={(option) => option.nome || ""} isOptionEqualToValue={(option, value) => option.id === value.id} onInputChange={handleBuscaAlimento} onChange={(event, newValue) => { setAlimentoSelecionado(newValue); }} renderInput={(params) => <TextField {...params} label="Buscar Alimento..." />} /></Grid><Grid item xs={6} sm={3}><TextField type="number" label="Qtd (g)" value={quantidadeAlimento} onChange={(e) => setQuantidadeAlimento(e.target.value)} fullWidth /></Grid><Grid item xs={6} sm={2}><IconButton color="primary" onClick={handleAddItemNaRefeicao} sx={{ height: '56px' }}><AddCircleOutlineIcon /></IconButton></Grid></Grid><List dense>{refeicaoAtual.itens.map((item, index) => (<ListItem key={index}><ListItemText primary={item.alimento.nome} secondary={`${item.quantidade}g`} /></ListItem>))}</List><Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={refeicaoAtual.itens.length === 0}>Salvar Refeição</Button></Box></Paper></Grid>
                    <Grid item xs={12}><Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Refeições de Hoje</Typography><List>{refeicoesDeHoje.map(refeicao => ( <ListItem key={refeicao.id} disablePadding secondaryAction={<IconButton edge="end" onClick={() => handleRefeicaoDelete(refeicao.id)}><DeleteIcon /></IconButton>}><ListItemText primary={`${refeicao.horario} - ${refeicao.tipo.replace(/_/g, " ")}`} secondary={refeicao.itens.map(item => `${item.alimento.nome} (${item.quantidade}g)`).join(', ')}/></ListItem>))}</List></Grid>
                    <Grid item xs={12}><Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Registros Gerais</Typography><List>{registrosFiltrados.map(reg => ( <ListItem key={reg.id} secondaryAction={<><IconButton edge="end" component={Link} to={`/editar-registro/${reg.id}`} sx={{ mr: 1 }}><EditIcon /></IconButton><IconButton edge="end" onClick={() => handleRegistroDelete(reg.id)}><DeleteIcon /></IconButton></>}> <ListItemText primary={`Data: ${new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - Peso: ${reg.peso ? `${reg.peso} kg` : 'N/A'}`} secondary={`Obs: ${reg.observacoes || 'Nenhuma'}`} /> </ListItem> ))} </List></Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default PainelPrincipal;