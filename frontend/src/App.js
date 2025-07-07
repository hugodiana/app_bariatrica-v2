// frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando componentes do MUI para a notificação
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Importação de todos os componentes de página
import Layout from './components/Layout';
import Login from './components/Login';
import Registration from './components/Registration';
import HomePage from './components/HomePage'; // Nossa nova página de painel
import EditarPerfil from './components/EditarPerfil';
import EditarRegistro from './components/EditarRegistro';
import RequestPasswordReset from './components/RequestPasswordReset';
import ConfirmPasswordReset from './components/ConfirmPasswordReset';

function App() {
  // Estado para controlar a notificação
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Função para mostrar a notificação (vamos passar para os componentes filhos)
  const handleNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Função para fechar a notificação
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Router>
        {/* O Snackbar agora fica fora do Routes para ser visível em todas as páginas */}
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                {notification.message}
            </Alert>
        </Snackbar>

        <Routes>
            {/* Rotas Públicas (NÃO usam o layout com sidebar) */}
            <Route path="/login" element={<Login handleNotification={handleNotification} />} />
            <Route path="/registro" element={<Registration handleNotification={handleNotification} />} />
            <Route path="/recuperar-senha" element={<RequestPasswordReset handleNotification={handleNotification} />} />
            <Route path="/password-reset-confirm/:uid/:token/" element={<ConfirmPasswordReset handleNotification={handleNotification} />} />

            {/* Rotas Privadas (que ficam DENTRO do nosso Layout) */}
            <Route path="/" element={<Layout />}>
                {/* A rota principal "/" agora renderiza nossa nova HomePage */}
                <Route index element={<HomePage handleNotification={handleNotification} />} />
                
                {/* Mantemos as outras rotas */}
                <Route path="editar-perfil" element={<EditarPerfil handleNotification={handleNotification} />} />
                <Route path="editar-registro/:id" element={<EditarRegistro handleNotification={handleNotification} />} />

                {/* Podemos adicionar as outras páginas aqui depois */}
                <Route path="agenda" element={<div>Página da Agenda em construção...</div>} />
                <Route path="dieta" element={<div>Página da Dieta em construção...</div>} />
                <Route path="progresso" element={<div>Página de Progresso em construção...</div>} />
                <Route path="diario" element={<div>Página do Diário em construção...</div>} />
            </Route>
        </Routes>
    </Router>
  );
}

// A linha mais importante que estava faltando
export default App;