// frontend/src/App.js

import React, { useState, useCallback } from 'react'; // useCallback está sendo usado
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dieta from './components/Dieta';

// Importação dos componentes
import Layout from './components/Layout';
import Login from './components/Login';
import Registration from './components/Registration';
import PainelPrincipal from './components/PainelPrincipal';
import EditarPerfil from './components/EditarPerfil';
import EditarRegistro from './components/EditarRegistro';
import RequestPasswordReset from './components/RequestPasswordReset';
import ConfirmPasswordReset from './components/ConfirmPasswordReset';

function App() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // A CORREÇÃO ESTÁ AQUI: Usamos o useCallback para estabilizar a função
  const handleNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []); // O array de dependências vazio garante que a função não seja recriada

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Router>
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                {notification.message}
            </Alert>
        </Snackbar>

        <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login handleNotification={handleNotification} />} />
            <Route path="/registro" element={<Registration handleNotification={handleNotification} />} />
            <Route path="/recuperar-senha" element={<RequestPasswordReset handleNotification={handleNotification} />} />
            <Route path="/password-reset-confirm/:uid/:token/" element={<ConfirmPasswordReset handleNotification={handleNotification} />} />

            {/* Rotas Privadas dentro do Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<PainelPrincipal handleNotification={handleNotification} />} />
                <Route path="painel" element={<PainelPrincipal handleNotification={handleNotification} />} />
                <Route path="editar-perfil" element={<EditarPerfil handleNotification={handleNotification} />} />
                <Route path="editar-registro/:id" element={<EditarRegistro handleNotification={handleNotification} />} />
                <Route path="agenda" element={<div>Página da Agenda em construção...</div>} />
                <Route path="dieta" element={<Dieta handleNotification={handleNotification} />} />
                <Route path="progresso" element={<div>Página de Progresso em construção...</div>} />
                <Route path="diario" element={<div>Página do Diário em construção...</div>} />
            </Route>
        </Routes>
    </Router>
  );
}

export default App;