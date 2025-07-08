// frontend/src/components/Dieta.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// A CORREÇÃO ESTÁ AQUI: Adicionamos 'TextField' à lista de imports
import { 
    Box, Container, Grid, Paper, Typography, Button, 
    List, ListItem, ListItemText, IconButton, Divider, 
    Select, MenuItem, InputLabel, FormControl, Autocomplete, CircularProgress, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Dieta({ handleNotification }) {
    const navigate = useNavigate();
    const [refeicoes, setRefeicoes] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [refeicaoAtual, setRefeicaoAtual] = useState({ tipo: 'almoco', horario: new Date().toTimeString().slice(0,5), itens: [] });
    const [alimentoSelecionado, setAlimentoSelecionado] = useState(null);
    const [alimentoBuscaResults, setAlimentoBuscaResults] = useState([]);
    const [quantidadeAlimento, setQuantidadeAlimento] = useState('');
    const [autocompleteKey, setAutocompleteKey] = useState(0);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        try {
            const [registrosRes, refeicoesRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/registros/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);
            if (!registrosRes.ok || !refeicoesRes.ok) { throw new Error('Falha ao carregar dados.'); }
            const registrosData = await registrosRes.json();
            const refeicoesData = await refeicoesRes.json();
            setRegistros(registrosData);
            setRefeicoes(refeicoesData);
        } catch (err) {
            handleNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBuscaAlimento = async (event, newValue) => { if (newValue && newValue.length > 2) { const token = localStorage.getItem('authToken'); const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/alimentos/?search=${newValue}`, { headers: { 'Authorization': `Token ${token}` } }); const data = await response.json(); setAlimentoBuscaResults(data); } else { setAlimentoBuscaResults([]); } };
    const handleAddItemNaRefeicao = () => { if (!alimentoSelecionado || !quantidadeAlimento) { handleNotification('Selecione um alimento e uma quantidade.', 'warning'); return; } setRefeicaoAtual({ ...refeicaoAtual, itens: [...refeicaoAtual.itens, { alimento: alimentoSelecionado, quantidade: quantidadeAlimento }] }); setAlimentoSelecionado(null); setQuantidadeAlimento(''); setAlimentoBuscaResults([]); setAutocompleteKey(prevKey => prevKey + 1); };
    const handleRefeicaoSubmit = async (e) => { e.preventDefault(); if (refeicaoAtual.itens.length === 0 || !refeicaoAtual.horario) { handleNotification('Adicione itens e defina um horário.', 'error'); return; } const token = localStorage.getItem('authToken'); const payload = { tipo: refeicaoAtual.tipo, horario: refeicaoAtual.horario, itens: refeicaoAtual.itens.map(item => ({ alimento_id: item.alimento.id, quantidade: item.quantidade })) }; try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(payload) }); if (response.status === 201) { handleNotification('Refeição salva com sucesso!', 'success'); setRefeicaoAtual({ tipo: 'almoco', horario: new Date().toTimeString().slice(0,5), itens: [] }); fetchData(); } else { const data = await response.json(); handleNotification(Object.values(data).flat().join(' ') || 'Falha ao salvar refeição.', 'error'); } } catch (err) { handleNotification('Erro de rede.', 'error'); } };
    const handleRefeicaoDelete = async (refeicaoId) => { if (window.confirm('Apagar esta refeição?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/${refeicaoId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }); if (response.status === 204) { handleNotification('Refeição apagada.', 'info'); fetchData(); } else { throw new Error('Falha ao apagar.'); } } catch (err) { handleNotification(err.message, 'error'); } } };

    const hojeString = new Date().toISOString().split('T')[0];
    const registroDeHoje = registros.find(r => r.data_registro === hojeString);
    const refeicoesDeHoje = refeicoes.filter(refeicao => refeicao.registro_diario === registroDeHoje?.id);
    
    // Lógica de cálculo de totais
    const totais = refeicoesDeHoje.reduce((acc, refeicao) => {
        refeicao.itens.forEach(item => {
            const fator = (parseFloat(item.quantidade) || 0) / (parseFloat(item.alimento.porcao_gramas) || 100);
            acc.calorias += (parseFloat(item.alimento.calorias) || 0) * fator;
            acc.proteinas += (parseFloat(item.alimento.proteinas) || 0) * fator;
            acc.carboidratos += (parseFloat(item.alimento.carboidratos) || 0) * fator;
            acc.gorduras += (parseFloat(item.alimento.gorduras) || 0) * fator;
        });
        return acc;
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });


    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Diário Alimentar de Hoje</Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{Math.round(totais.calorias)}</Typography><Typography variant="body2">Kcal</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{Math.round(totais.proteinas)} g</Typography><Typography variant="body2">Proteínas</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{Math.round(totais.carboidratos)} g</Typography><Typography variant="body2">Carboidratos</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{Math.round(totais.gorduras)} g</Typography><Typography variant="body2">Gorduras</Typography></Paper></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '20px' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Registrar Refeição</Typography>
                        <Box component="form" onSubmit={handleRefeicaoSubmit}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Tipo</InputLabel><Select name="tipo" value={refeicaoAtual.tipo} label="Tipo" onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, tipo: e.target.value })}><MenuItem value="cafe_da_manha">Café da Manhã</MenuItem><MenuItem value="lanche_da_manha">Lanche da Manhã</MenuItem><MenuItem value="almoco">Almoço</MenuItem><MenuItem value="lanche_da_tarde">Lanche da Tarde</MenuItem><MenuItem value="jantar">Jantar</MenuItem><MenuItem value="ceia">Ceia</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12} sm={6}><TextField type="time" name="horario" value={refeicaoAtual.horario} onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, horario: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} label="Horário" /></Grid>
                            </Grid>
                            <Divider sx={{mb: 2}}><Typography variant="overline">Adicionar Alimento</Typography></Divider>
                            <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={7}><Autocomplete key={autocompleteKey} options={alimentoBuscaResults} getOptionLabel={(option) => option.nome || ""} isOptionEqualToValue={(option, value) => option.id === value.id} onInputChange={handleBuscaAlimento} onChange={(event, newValue) => { setAlimentoSelecionado(newValue); }} renderInput={(params) => <TextField {...params} label="Buscar Alimento..." />} /></Grid>
                                <Grid item xs={6} sm={3}><TextField type="number" label="Qtd (g)" value={quantidadeAlimento} onChange={(e) => setQuantidadeAlimento(e.target.value)} fullWidth /></Grid>
                                <Grid item xs={6} sm={2}><Button variant="outlined" onClick={handleAddItemNaRefeicao} sx={{height: '56px', width: '100%'}}>Add +</Button></Grid>
                            </Grid>
                            <List dense>{refeicaoAtual.itens.map((item, index) => (<ListItem key={index}><ListItemText primary={item.alimento.nome} secondary={`${item.quantidade}g`} /></ListItem>))}</List>
                            <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={refeicaoAtual.itens.length === 0}>Salvar Refeição</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper sx={{p: 2}}>
                        <Typography variant="h6" gutterBottom>Refeições Registradas</Typography>
                        <List>{refeicoesDeHoje.length > 0 ? refeicoesDeHoje.map(refeicao => ( <ListItem key={refeicao.id} disablePadding secondaryAction={<IconButton edge="end" onClick={() => handleRefeicaoDelete(refeicao.id)}><DeleteIcon /></IconButton>}><ListItemText primary={`${refeicao.horario} - ${refeicao.tipo.replace(/_/g, " ")}`} secondary={refeicao.itens.map(item => `${item.alimento.nome} (${item.quantidade}g)`).join(', ')}/></ListItem>)) : <Typography variant="body2" color="text.secondary">Nenhuma refeição registrada para hoje.</Typography>}</List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dieta;