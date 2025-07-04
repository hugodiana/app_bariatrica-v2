// frontend/src/components/GraficoAgua.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function GraficoAgua({ data }) {
  const formattedData = data
    .map(registro => ({
      data: new Date(registro.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      agua_ml: registro.agua_ml ? parseInt(registro.agua_ml, 10) : 0,
    }))
    .filter(d => d.agua_ml > 0) // Mostra apenas dias com consumo
    .reverse();

  if (formattedData.length === 0) {
    return <p>Adicione registros de consumo de água para ver o gráfico.</p>;
  }

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis unit="ml" />
          <Tooltip formatter={(value) => `${value} ml`} />
          <Legend />
          <Bar dataKey="agua_ml" fill="#8884d8" name="Água (ml)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoAgua;