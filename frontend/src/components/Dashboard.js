// frontend/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  // A correção está aqui: inicializamos o hook para obter a função de navegação.
  const navigate = useNavigate();
  
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove a chave de acesso
    navigate('/login'); // Redireciona para a página de login
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Se não houver token, não prossiga e redirecione para o login
      navigate('/login');
      return;
    }

    async function fetchPerfil() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/meu-perfil/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPerfil(data);
        } else {
          // Se o token for inválido, limpa e redireciona
          setError('Sessão inválida. Por favor, faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } catch (err) {
        setError('Erro de rede ao buscar dados.');
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, [navigate]); // Adicionamos 'navigate' como dependência

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!perfil) return <div>Nenhum perfil encontrado.</div>;

  return (
    <div>
      <button onClick={handleLogout} style={{ float: 'right', margin: '10px' }}>
        Sair
      </button>

      <h1>Meu Perfil</h1>
      <h2>Olá, {perfil.usuario.first_name || perfil.usuario.username}!</h2>
      <p><strong>Data da Cirurgia:</strong> {perfil.data_cirurgia || 'Não informada'}</p>
      <p><strong>Peso Inicial:</strong> {perfil.peso_inicial || 'Não informado'} kg</p>
      <p><strong>Meta de Peso:</strong> {perfil.meta_peso || 'Não informada'} kg</p>

      <Link to="/editar-perfil">
        <button>Editar Perfil</button>
      </Link>
    </div>
  );
}

export default Dashboard;