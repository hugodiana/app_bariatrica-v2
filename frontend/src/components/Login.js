// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para guardar mensagens de erro

  // Transformamos a função em 'async' para poder usar 'await'
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros antigos

    try {
      // Fazemos a requisição para o backend
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST', // O método para enviar dados
        headers: {
          'Content-Type': 'application/json', // Avisa que estamos enviando JSON
        },
        // Converte nosso usuário e senha para o formato JSON
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        // Se a resposta for bem-sucedida (status 2xx)
        const data = await response.json();
        console.log('Login bem-sucedido:', data);

        // Guarda o token no armazenamento local do navegador
        localStorage.setItem('authToken', data.key); 

        alert('Login realizado com sucesso!');
        // No futuro, aqui nós redirecionaríamos o usuário para o painel principal
        // window.location.href = '/dashboard'; 
        navigate('/dashboard');
      } else {
        // Se o servidor responder com um erro (ex: credenciais erradas)
        const errorData = await response.json();
        console.error('Erro no login:', errorData);
        setError('Usuário ou senha inválidos. Tente novamente.');
      }
    } catch (err) {
      // Se houver um erro na rede (ex: servidor desligado)
      console.error('Erro de rede:', err);
      setError('Não foi possível conectar ao servidor.');
    }
  };

return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>

      {/* PARTE IMPORTANTE - VERIFIQUE SE ESTÁ AQUI */}
      <p>
        Não tem uma conta? <Link to="/registro">Registre-se aqui</Link>.
      </p>

    </div>
  );
}

export default Login;