// frontend/src/components/PainelPrincipal.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';

// Importando componentes do Material-UI
import { 
    CssBaseline, Box, Container, Grid, Paper, Typography, Button, 
    TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
    IconButton, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function PainelPrincipal() {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [formData, setFormData] = useState({
        peso: '',
        agua_ml: '',
        vitaminas_tomadas: false,
        observacoes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const [perfilRes, registrosRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/meu-perfil/', { headers: { 'Authorization': `Token ${token}` } }),
                    fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', { headers: { 'Authorization': `Token ${token}` } })
                ]);
                if (!perfilRes.ok || !registrosRes.ok) { throw new Error('Falha ao carregar dados.'); }
                const perfilData = await perfilRes.json();
                const registrosData = await registrosRes.json();
                setPerfil(perfilData);
                setRegistros(registrosData);
            } catch (err) { setError(err.message); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
    const handleChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setFormData({ ...formData, [e.target.name]: value }); };
    const handleSubmit = async (e) => { e.preventDefault(); setError(''); const token = localStorage.getItem('authToken'); try { const response = await fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`}, body: JSON.stringify(formData), }); if (response.status === 201) { alert('Registro salvo!'); setFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' }); const registrosRes = await fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', { headers: { 'Authorization': `Token ${token}` } }); const registrosData = await registrosRes.json(); setRegistros(registrosData); } else { const data = await response.json(); setError(Object.values(data).flat().join(' ') || 'Falha ao salvar.'); } } catch (err) { setError('Erro de rede.'); } };
    const handleDelete = async (registroId) => { if (window.confirm('Tem certeza?')) { const token = localStorage.getItem('authToken'); try { const response = await fetch(`http://127.0.0.1:8000/api/acompanhamento/registros/${registroId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` }, }); if (response.status === 204) { setRegistros(registros.filter(reg => reg.id !== registroId)); } else { throw new Error('Falha ao apagar.'); } } catch (err) { setError(err.message); } } };

    // LÓGICA DE CÁLCULO
    let ultimoRegistroComPeso = null;
    if (registros && registros.length > 0) {
        ultimoRegistroComPeso = registros.find(reg => reg.peso);
    }
    let imc = null;
    let perdaTotal = null;
    if (perfil && perfil.altura_cm && ultimoRegistroComPeso) {
        const alturaMetros = perfil.altura_cm / 100;
        imc = (ultimoRegistroComPeso.peso / (alturaMetros * alturaMetros)).toFixed(1);
    }
    if (perfil && perfil.peso_inicial && ultimoRegistroComPeso) {
        perdaTotal = (perfil.peso_inicial - ultimoRegistroComPeso.peso).toFixed(1);
    }

    if (loading) return <div>Carregando...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}><h1>Erro</h1><p>{error}</p><button onClick={() => navigate('/login')}>Voltar</button></div>;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Seção do Perfil */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {perfil && (
                                <>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>Meu Perfil</Typography>
                                    <Typography component="p" variant="h5">Olá, {perfil.usuario.first_name || perfil.usuario.username}!</Typography>
                                    {imc && <Typography variant="body1" sx={{ mt: 2 }}><strong>IMC Atual:</strong> {imc}</Typography>}
                                    {perdaTotal && <Typography variant="body1" color={perdaTotal > 0 ? "green" : "red"}><strong>Peso Perdido:</strong> {perdaTotal} kg</Typography>}
                                    <Divider sx={{ my: 2 }} />
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>Data da Cirurgia: {perfil.data_cirurgia || 'Não informada'}</Typography>
                                    <Typography color="text.secondary">Peso Inicial: {perfil.peso_inicial || 'Não informado'} kg</Typography>
                                    <Link to="/editar-perfil"><Button size="small" sx={{mt: 2, justifyContent: 'flex-start'}}>Editar Perfil</Button></Link>
                                    <Button size="small" color="error" onClick={handleLogout} sx={{mt: 1, justifyContent: 'flex-start'}}>Sair</Button>
                                </>
                            )}
                        </Paper>
                    </Grid>
                    {/* Seção do Gráfico */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}>
                            {registros && registros.length > 0 ? <GraficoPeso data={registros} /> : <Typography>Adicione registros de peso para ver o gráfico.</Typography>}
                        </Paper>
                    </Grid>
                    {/* Seção de Registro Diário */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                             <Typography component="h2" variant="h6" color="primary" gutterBottom>Registro de Hoje</Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}><TextField type="number" name="peso" label="Peso (kg)" value={formData.peso} onChange={handleChange} fullWidth /></Grid>
                                    <Grid item xs={12} sm={4}><TextField type="number" name="agua_ml" label="Água (ml)" value={formData.agua_ml} onChange={handleChange} fullWidth /></Grid>
                                    <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={formData.vitaminas_tomadas} onChange={handleChange} name="vitaminas_tomadas" />} label="Tomei as vitaminas" /></Grid>
                                    <Grid item xs={12}><TextField name="observacoes" label="Observações do dia..." value={formData.observacoes} onChange={handleChange} multiline rows={2} fullWidth /></Grid>
                                </Grid>
                                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar Registro</Button>
                            </Box>
                        </Paper>
                    </Grid>
                    {/* Seção do Histórico */}
                     <Grid item xs={12}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Histórico de Registros</Typography>
                        <List>
                            {registros && registros.map(reg => (
                                <ListItem key={reg.id} secondaryAction={
                                    <>
                                        <IconButton edge="end" aria-label="edit" component={Link} to={`/editar-registro/${reg.id}`} sx={{ mr: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(reg.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }>
                                    {/* O erro estava aqui, havia um "}>" extra que foi removido. */}
                                    <ListItemText 
                                        primary={`Data: ${new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - Peso: ${reg.peso ? `${reg.peso} kg` : 'N/A'}`}
                                        secondary={`Obs: ${reg.observacoes || 'Nenhuma'}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default PainelPrincipal;