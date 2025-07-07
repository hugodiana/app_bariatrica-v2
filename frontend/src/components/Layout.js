// frontend/src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importante para renderizar as páginas filhas
import { Box, CssBaseline, Drawer, Toolbar, AppBar, Typography } from '@mui/material';
import Sidebar from './Sidebar'; // Vamos criar este componente a seguir

const drawerWidth = 240; // Largura da barra lateral

function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Cabeçalho Superior */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Meu Painel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Barra Lateral Fixa */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar /> 
        <Sidebar />
      </Drawer>

      {/* Área de Conteúdo Principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar /> 
        {/* O Outlet é o espaço reservado onde as nossas páginas (Painel, Editar, etc.) serão renderizadas */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;