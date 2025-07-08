// frontend/src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// A largura da sidebar, recebida como propriedade para manter a consistência
const drawerWidth = 240;

function Header({ handleDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        // Em telas médias (md) ou maiores, o Appbar tem uma margem para não ficar sobre a sidebar.
        // Em telas menores, ele ocupa 100% da largura.
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {/* O botão de menu (hambúrguer) só aparece em telas menores que 'md' */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Meu Painel
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;