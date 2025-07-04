// frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Importação de todos os componentes de página
import Login from './components/Login';
import Registration from './components/Registration';
import PainelPrincipal from './components/PainelPrincipal';
import EditarPerfil from './components/EditarPerfil';
import EditarRegistro from './components/EditarRegistro';
import RequestPasswordReset from './components/RequestPasswordReset';
import ConfirmPasswordReset from './components/ConfirmPasswordReset';

function PaginaInicial() {
  return <h1>Bem-vindo à Aplicação!</h1>;
}

function App() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const handleNotification = (message, severity = 'success') => { setNotification({ open: true, message, severity }); };
  const handleCloseNotification = (event, reason) => { if (reason === 'clickaway') { return; } setNotification({ ...notification, open: false }); };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/login" element={<Login handleNotification={handleNotification} />} />
          <Route path="/registro" element={<Registration handleNotification={handleNotification} />} />
          <Route path="/recuperar-senha" element={<RequestPasswordReset handleNotification={handleNotification} />} />
          <Route path="/password-reset-confirm/:uid/:token/" element={<ConfirmPasswordReset handleNotification={handleNotification} />} />

          <Route path="/painel" element={<PainelPrincipal handleNotification={handleNotification} />} />
          <Route path="/editar-perfil" element={<EditarPerfil handleNotification={handleNotification} />} />
          <Route path="/editar-registro/:id" element={<EditarRegistro handleNotification={handleNotification} />} />
        </Routes>
      </div>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Router>
  );
}

export default App;