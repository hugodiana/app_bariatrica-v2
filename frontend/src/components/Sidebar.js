// frontend/src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Ícone de exemplo

function Sidebar() {
  return (
    <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
            BariPlus
        </Typography>
        <Divider />
        <List>
            <ListItem key="Painel" disablePadding>
                <ListItemButton component={Link} to="/painel">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Painel" />
                </ListItemButton>
            </ListItem>
            {/* Aqui adicionaremos mais links no futuro (Agenda, Dieta, etc.) */}
        </List>
    </Box>
  );
}
export default Sidebar;