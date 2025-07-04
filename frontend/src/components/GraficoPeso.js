// frontend/src/components/GraficoPeso.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function GraficoPeso({ data }) {
  // Formata os dados para o gráfico, garantindo ordem cronológica
  const formattedData = data
    .map(registro => ({
      data: new Date(registro.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: parseFloat(registro.peso),
    }))
    .filter(d => !isNaN(d.peso)) // Filtra registros sem peso
    .reverse(); 

  if (formattedData.length < 2) {
    return <p>É necessário ter pelo menos 2 registros de peso para exibir o gráfico.</p>;
  }

  // Define o domínio do eixo Y para dar uma margem visual
  const pesos = formattedData.map(d => d.peso);
  const minPeso = Math.min(...pesos) - 2;
  const maxPeso = Math.max(...pesos) + 2;

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px', marginBottom: '20px' }}>
      <h3>Evolução do Peso</h3>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis domain={[minPeso, maxPeso]} unit="kg" />
          <Tooltip formatter={(value) => `${value} kg`} />
          <Legend />
          <Line type="monotone" dataKey="peso" stroke="#8884d8" activeDot={{ r: 8 }} name="Peso (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoPeso;