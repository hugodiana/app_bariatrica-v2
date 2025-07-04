// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação de todos os componentes de página
import Login from './components/Login';
import Registration from './components/Registration';
import PainelPrincipal from './components/PainelPrincipal';
import EditarPerfil from './components/EditarPerfil';
import EditarRegistro from './components/EditarRegistro'; // Garanta que esta linha esteja SEM as chaves {}

// Componente simples para a página inicial
function PaginaInicial() {
  return <h1>Bem-vindo à Aplicação!</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registration />} />

          {/* Rotas Privadas (após login) */}
          <Route path="/painel" element={<PainelPrincipal />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/editar-registro/:id" element={<EditarRegistro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;