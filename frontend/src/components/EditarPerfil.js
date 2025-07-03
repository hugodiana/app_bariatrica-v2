// frontend/src/components/EditarPerfil.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditarPerfil() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data_cirurgia: '',
    peso_inicial: '',
    meta_peso: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    async function fetchPerfil() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/meu-perfil/', {
          headers: { 'Authorization': `Token ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            data_cirurgia: data.data_cirurgia || '',
            peso_inicial: data.peso_inicial || '',
            meta_peso: data.meta_peso || '',
          });
        } else {
          throw new Error('Falha ao carregar perfil.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/meu-perfil/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
        navigate('/dashboard');
      } else {
        throw new Error('Falha ao atualizar o perfil.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="data_cirurgia">Data da Cirurgia:</label>
          <input
            type="date"
            id="data_cirurgia"
            name="data_cirurgia"
            value={formData.data_cirurgia}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="peso_inicial">Peso Inicial (kg):</label>
          <input
            type="number"
            step="0.1"
            id="peso_inicial"
            name="peso_inicial"
            value={formData.peso_inicial}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="meta_peso">Meta de Peso (kg):</label>
          <input
            type="number"
            step="0.1"
            id="meta_peso"
            name="meta_peso"
            value={formData.meta_peso}
            onChange={handleChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={() => navigate('/dashboard')} style={{ marginLeft: '10px' }}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default EditarPerfil;