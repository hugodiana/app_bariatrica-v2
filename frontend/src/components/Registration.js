// frontend/src/components/Registration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // Campo para confirmação de senha
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpa erros antigos

    // Validação simples no frontend
    if (formData.password !== formData.password2) {
      setErrors({ password2: 'As senhas não coincidem.' });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/registration/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  username: formData.username,
  email: formData.email,
  password1: formData.password, // Envia o campo 'password' do formulário como 'password1'
  password2: formData.password2, // Envia o campo 'password2' do formulário como 'password2'
        }),
      });

      if (response.status === 201) { // 201 Created é a resposta de sucesso para registro
        alert('Usuário registrado com sucesso! Por favor, faça o login.');
        navigate('/login');
      } else {
        // Se o backend retornar erros (ex: usuário já existe)
        const data = await response.json();
        setErrors(data);
      }
    } catch (err) {
      setErrors({ general: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' });
    }
  };

  return (
    <div>
      <h1>Registrar Nova Conta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            required
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="password2">Confirmar Senha:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            onChange={handleChange}
            required
          />
          {errors.password2 && <p style={{ color: 'red' }}>{errors.password2}</p>}
        </div>
        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Registration;