// frontend/src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';

// Importando os ícones
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TimelineIcon from '@mui/icons-material/Timeline';
import BookIcon from '@mui/icons-material/Book';

function Sidebar() {
  const menuItems = [
    // A CORREÇÃO ESTÁ AQUI: Mudamos o texto e o caminho (path)
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Agenda', icon: <EventNoteIcon />, path: '/agenda' },
    { text: 'Dieta', icon: <RestaurantMenuIcon />, path: '/dieta' },
    { text: 'Progresso', icon: <TimelineIcon />, path: '/progresso' },
    { text: 'Diário', icon: <BookIcon />, path: '/diario' },
  ];

  const activeLinkStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: '8px', // Adicionando um leve arredondamento para o item ativo
    color: 'primary.main',
    '& .MuiListItemIcon-root': { // Garante que o ícone também mude de cor
        color: 'primary.main',
    },
  };

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ my: 2 }}>
          BariPlus
        </Typography>
      </Box>
      <Divider />
      <List sx={{p: 1}}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{mb: 1}}>
            <ListItemButton 
              component={NavLink} 
              to={item.path}
              // O NavLink v6 usa uma função para o estilo ativo, mas o sx é mais simples
              sx={({ isActive }) => isActive ? activeLinkStyle : {}}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;