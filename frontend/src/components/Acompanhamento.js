// frontend/src/components/Acompanhamento.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GraficoPeso from './GraficoPeso';

function Acompanhamento() {
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
    console.log("--- DEBUG ---");
    console.log("1. Componente montou, useEffect iniciou.");

    const token = localStorage.getItem('authToken');
    console.log("2. Token encontrado no localStorage:", token);

    if (!token) {
        console.log("3. ERRO: Sem token! Redirecionando para /login.");
        navigate('/login');
        return;
    }

    const fetchData = async () => {
        console.log("4. A função fetchData foi chamada. Tentando buscar...");
        setLoading(true);
        try {
            const [perfilRes, registrosRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/meu-perfil/', {
                    headers: { 'Authorization': `Token ${token}` }
                }),
                fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', {
                    headers: { 'Authorization': `Token ${token}` }
                })
            ]);

            console.log("5. Respostas da API recebidas.");

            if (!perfilRes.ok || !registrosRes.ok) {
                throw new Error('Falha ao carregar dados. Sua sessão pode ter expirado.');
            }

            const perfilData = await perfilRes.json();
            const registrosData = await registrosRes.json();

            console.log("6. Dados convertidos para JSON. Atualizando o estado.");
            setPerfil(perfilData);
            setRegistros(registrosData);

        } catch (err) {
            console.error("7. ERRO na busca de dados:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
                body: JSON.stringify(formData),
            });
            if (response.status === 201) {
                alert('Registro salvo!');
                setFormData({ peso: '', agua_ml: '', vitaminas_tomadas: false, observacoes: '' });
                // Busca os dados novamente para atualizar a tela
                const registrosRes = await fetch('http://127.0.0.1:8000/api/acompanhamento/registros/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                const registrosData = await registrosRes.json();
                setRegistros(registrosData);
            } else {
                const data = await response.json();
                setError(Object.values(data).flat().join(' ') || 'Falha ao salvar.');
            }
        } catch (err) {
            setError('Erro de rede. Tente novamente.');
        }
    };
    
    const handleDelete = async (registroId) => {
        if (window.confirm('Tem certeza que deseja apagar este registro?')) {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/acompanhamento/registros/${registroId}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (response.status === 204) {
                    setRegistros(registros.filter(reg => reg.id !== registroId));
                } else { throw new Error('Falha ao apagar o registro.'); }
            } catch (err) { setError(err.message); }
        }
    };

    if (loading) return <div>Carregando...</div>;
    
    if (error) return <div style={{ color: 'red', padding: '20px' }}><h1>Erro</h1><p>{error}</p><button onClick={() => navigate('/login')}>Voltar para Login</button></div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={handleLogout} style={{ float: 'right' }}>Sair</button>
            
            {perfil && (
                <section>
                    <h1>Meu Perfil</h1>
                    <h2>Olá, {perfil.usuario.first_name || perfil.usuario.username}!</h2>
                    <p><strong>Data da Cirurgia:</strong> {perfil.data_cirurgia || 'Não informada'}</p>
                    <p><strong>Peso Inicial:</strong> {perfil.peso_inicial || 'Não informado'} kg</p>
                    <p><strong>Meta de Peso:</strong> {perfil.meta_peso || 'Não informada'} kg</p>
                    <Link to="/editar-perfil"><button>Editar Perfil</button></Link>
                </section>
            )}

            <hr style={{margin: '20px 0'}} />

            <section>
                <h3>Registro de Hoje</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <input type="number" step="0.1" name="peso" value={formData.peso} onChange={handleChange} placeholder="Peso em kg" style={{ marginRight: '10px' }} />
                        <input type="number" name="agua_ml" value={formData.agua_ml} onChange={handleChange} placeholder="Água (ml)" style={{ marginRight: '10px' }} />
                        <label>
                            <input type="checkbox" name="vitaminas_tomadas" checked={formData.vitaminas_tomadas} onChange={handleChange} />
                            Tomei as vitaminas
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações do dia..." style={{ width: '300px', height: '60px' }}></textarea>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Salvar Registro do Dia</button>
                </form>
            </section>
            
            <hr style={{margin: '20px 0'}} />

            {registros && registros.length > 0 && (
                <section>
                    <h3>Evolução do Peso</h3>
                    <GraficoPeso data={registros} />
                </section>
            )}

            <hr style={{margin: '20px 0'}} />

            <section>
                <h2>Histórico de Registros</h2>
                <ul>
                    {registros && registros.map(reg => (
                        <li key={reg.id} style={{ listStyle: 'none', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <strong>Data:</strong> {new Date(reg.data_registro + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} - 
                            <strong>Peso:</strong> {reg.peso ? `${reg.peso} kg` : 'N/A'}
                            <p style={{margin: '5px 0'}}>Obs: {reg.observacoes || 'Nenhuma'}</p>
                            <button onClick={() => handleDelete(reg.id)} style={{color: 'red', fontSize: '12px'}}>Apagar</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Acompanhamento;