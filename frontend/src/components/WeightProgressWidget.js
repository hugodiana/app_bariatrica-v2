// frontend/src/components/WeightProgressWidget.js
import React from 'react';
import { Paper, Typography } from '@mui/material';
import GraficoPeso from './GraficoPeso'; // Reutilizando nosso gráfico existente

function WeightProgressWidget({ data }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 280 }}>
      <Typography component="h3" variant="h6" color="primary" gutterBottom>
        Evolução do Peso
      </Typography>
      <GraficoPeso data={data} />
    </Paper>
  );
}
export default WeightProgressWidget;