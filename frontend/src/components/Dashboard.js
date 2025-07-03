// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [perfil, setPerfil] = useState(null); // Guarda os dados do perfil
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pega o token do armazenamento local
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Nenhum token de autenticação encontrado. Por favor, faça login.');
      setLoading(false);
      // Opcional: redirecionar para a página de login
      // window.location.href = '/login';
      return;
    }

    async function fetchPerfil() {
      try {
        // Faz a requisição para o nosso endpoint protegido
        const response = await fetch('http://127.0.0.1:8000/api/meu-perfil/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // A linha mais importante: enviando nosso token para autorização
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPerfil(data);
        } else {
          // Se o token for inválido ou expirado
          setError('Não foi possível carregar os dados do perfil. Token inválido?');
          // Opcional: remover o token inválido e redirecionar
          // localStorage.removeItem('authToken');
          // window.location.href = '/login';
        }
      } catch (err) {
        setError('Erro de rede ao buscar dados.');
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, []); // O array vazio [] garante que isso só roda uma vez

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!perfil) return <div>Nenhum perfil encontrado.</div>;

  return (
    <div>
      <h1>Meu Perfil</h1>
      <h2>Olá, {perfil.usuario.first_name || perfil.usuario.username}!</h2>
      <p><strong>Data da Cirurgia:</strong> {perfil.data_cirurgia || 'Não informada'}</p>
      <p><strong>Peso Inicial:</strong> {perfil.peso_inicial || 'Não informado'} kg</p>
      <p><strong>Meta de Peso:</strong> {perfil.meta_peso || 'Não informada'} kg</p>
    </div>
  );
}

export default Dashboard;