// frontend/src/App.js

import React, { useState, useCallback } from 'react';
// A MUDANÇA ESTÁ AQUI: Trocamos BrowserRouter por HashRouter
import { HashRouter as Router, Routes, Route } from 'react-router-dom';import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Importação de todos os componentes de página
import Layout from './components/Layout';
import Login from './components/Login';
import Registration from './components/Registration';
import PainelPrincipal from './components/PainelPrincipal';
import EditarPerfil from './components/EditarPerfil';
import EditarRegistro from './components/EditarRegistro';
import RequestPasswordReset from './components/RequestPasswordReset';
import ConfirmPasswordReset from './components/ConfirmPasswordReset';
import Agenda from './components/Agenda';
import Dieta from './components/Dieta';
import Progresso from './components/Progresso';
import Diario from './components/Diario';

function App() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const handleNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);
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
                <Route path="agenda" element={<Agenda handleNotification={handleNotification} />} />
                <Route path="dieta" element={<Dieta handleNotification={handleNotification} />} />
                <Route path="progresso" element={<Progresso handleNotification={handleNotification} />} />
                <Route path="diario" element={<Diario handleNotification={handleNotification} />} />
            </Route>
        </Routes>
    </Router>
  );
}

export default App;