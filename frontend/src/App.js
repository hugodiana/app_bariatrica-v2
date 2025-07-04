// frontend/src/App.js

import React from 'react';
// 1. Garanta que 'Routes' e 'Route' estão sendo importados
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// 2. Garanta que todos os seus componentes de página estão sendo importados
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EditarPerfil from './components/EditarPerfil';
import Registration from './components/Registration';
import Acompanhamento from './components/Acompanhamento';
import PainelPrincipal from './components/PainelPrincipal';

// Componente simples para a página inicial
function PaginaInicial() {
  return <h1>Bem-vindo à Aplicação!</h1>;
}

function App() {
  return (
    <Router>
      <div>
        {/* O <Routes> é o container para todas as rotas individuais */}
        <Routes>
          {/* 3. Garanta que a rota para "/registro" existe aqui dentro */}
          <Route path="/registro" element={<Registration />} />

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Acompanhamento />} />
          <Route path="/painel" element={<PainelPrincipal />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/dashboard" element={<Acompanhamento />} />         </Routes>
      </div>
    </Router>
  );
}

export default App;