// frontend/src/components/RemindersWidget.js
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

function RemindersWidget() {
  const reminders = [
    "Beber 2L de água",
    "Tomar multivitamínico",
    "Registrar sentimentos no diário",
  ];

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography component="h3" variant="h6" color="primary" gutterBottom>
        Lembretes do Dia
      </Typography>
      <List>
        {reminders.map((text, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText primary={text} />
            </ListItem>
            {index < reminders.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}
export default RemindersWidget;