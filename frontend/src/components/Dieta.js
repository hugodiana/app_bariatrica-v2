// frontend/src/components/Dieta.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';

function Dieta({ handleNotification }) {
    const navigate = useNavigate();
    const [refeicoes, setRefeicoes] = useState([]);
    const [totais, setTotais] = useState({ calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
    const [loading, setLoading] = useState(true);

    const calcularTotais = useCallback((refeicoesData) => {
        let totaisDoDia = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };

        refeicoesData.forEach(refeicao => {
            refeicao.itens.forEach(item => {
                const quantidade = parseFloat(item.quantidade);
                const porcao = parseFloat(item.alimento.porcao_gramas);
                
                // Calcula o fator de multiplicação baseado na porção
                const fator = quantidade / porcao;

                totaisDoDia.calorias += parseFloat(item.alimento.calorias) * fator;
                totaisDoDia.proteinas += parseFloat(item.alimento.proteinas) * fator;
                totaisDoDia.carboidratos += parseFloat(item.alimento.carboidratos) * fator;
                totaisDoDia.gorduras += parseFloat(item.alimento.gorduras) * fator;
            });
        });

        // Arredonda os totais
        totaisDoDia.calorias = Math.round(totaisDoDia.calorias);
        totaisDoDia.proteinas = Math.round(totaisDoDia.proteinas);
        totaisDoDia.carboidratos = Math.round(totaisDoDia.carboidratos);
        totaisDoDia.gorduras = Math.round(totaisDoDia.gorduras);

        setTotais(totaisDoDia);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                const hojeString = new Date().toISOString().split('T')[0];
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/acompanhamento/refeicoes/?data_registro=${hojeString}`, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (!response.ok) throw new Error('Falha ao carregar as refeições de hoje.');
                
                const data = await response.json();
                setRefeicoes(data);
                calcularTotais(data); // Calcula os totais assim que os dados chegam
            } catch (err) {
                handleNotification(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, handleNotification, calcularTotais]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Resumo da Dieta de Hoje</Typography>
            
            {/* Cards com os totais */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{totais.calorias}</Typography><Typography variant="body2">Kcal</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{totais.proteinas} g</Typography><Typography variant="body2">Proteínas</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{totais.carboidratos} g</Typography><Typography variant="body2">Carboidratos</Typography></Paper></Grid>
                <Grid item xs={6} sm={3}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">{totais.gorduras} g</Typography><Typography variant="body2">Gorduras</Typography></Paper></Grid>
            </Grid>

            <Divider />

            {/* Lista de Refeições Detalhada */}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Refeições Registradas</Typography>
            {refeicoes.length > 0 ? refeicoes.map(refeicao => (
                <Paper key={refeicao.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">{refeicao.tipo.replace(/_/g, " ")} - {refeicao.horario}</Typography>
                    <List dense>
                        {refeicao.itens.map(item => (
                            <ListItem key={item.id}>
                                <ListItemText 
                                    primary={`${item.alimento.nome} (${item.quantidade}g)`}
                                    secondary={`Aprox. ${Math.round((parseFloat(item.quantidade) / parseFloat(item.alimento.porcao_gramas)) * parseFloat(item.alimento.calorias))} kcal`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )) : (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Nenhuma refeição registrada para hoje.</Typography>
            )}
        </Container>
    );
}

export default Dieta;