// frontend/src/components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header'; // Importamos nosso novo cabeçalho
import Sidebar from './Sidebar';

const drawerWidth = 240;

function Layout() {
  // Hook do MUI para pegar o tema atual e usar seus breakpoints
  const theme = useTheme();
  // Hook do MUI que retorna 'true' se a tela for do tamanho 'md' (médio) ou maior
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Estado para controlar a abertura da sidebar no modo mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* O Cabeçalho agora é nosso componente separado */}
      <Header handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* --- DRAWER PARA TELAS PEQUENAS (TEMPORÁRIO) --- */}
        {/* Ele só é renderizado se a tela NÃO for 'md' ou maior */}
        {!isMdUp && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Melhora a performance em mobile
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Sidebar />
          </Drawer>
        )}

        {/* --- DRAWER PARA TELAS GRANDES (PERMANENTE) --- */}
        {/* Ele só é renderizado se a tela for 'md' ou maior */}
        {isMdUp && (
          <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}}>
            <Sidebar />
          </Drawer>
        )}
      </Box>

      {/* Área de Conteúdo Principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar embaixo do header */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;